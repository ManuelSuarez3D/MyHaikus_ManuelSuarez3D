using AutoMapper;
using Haiku.API.Dtos;
using Haiku.API.Exceptions;
using Haiku.API.Models;
using Haiku.API.Repositories.UserRepositories;
using Haiku.API.Services.IProfileServices;
using Haiku.API.Utilities;

namespace Haiku.API.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IProfileService _userprofileService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private const long DefaultUserId = 2;

        public UserService(IUserRepository userRepository, IProfileService userprofileService, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userRepository = userRepository;
            _userprofileService = userprofileService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="UserDto"/>, optionally filtered by a search term.
        /// </summary>
        /// <param name="pageNumber">The page number to retrieve (1-based index).</param>
        /// <param name="pageSize">The number of <see cref="User"/> to return per page.</param>
        /// <param name="searchOption">An optional search term to filter <see cref="User"/> by their properties.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an enumerable collection of <see cref="UserDto"/> objects.</returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="User"/>'s cannot be retrieved.
        /// </exception>
        public async Task<IEnumerable<UserDto>> GetPaginatedUsersAsync(int pageNumber, int pageSize, string searchOption)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            var users = await _userRepository.GetPaginatedUsersAsync(pageNumber, pageSize, searchOption);

            if (users == null)
                throw new NotRetrievedException($"Users were not retrieved successfully.");

            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
            return userDtos;
        }

        /// <summary>
        /// Retrieves the total count of <see cref="User"/>'s, optionally filtered by a search term.
        /// </summary>
        /// <param name="searchOption">An optional search term to filter the <see cref="User"/>'s.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="User"/>'s.</returns>
        public async Task<int> GetTotalUsersAsync(string searchOption)
        {
            return await _userRepository.GetTotalUsersAsync(searchOption);
        }

        /// <summary>
        /// Retrieves an <see cref="UserDto"/> by their unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="User"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the corresponding <see cref="UserDto"/>.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="User"/> with the specified ID is not found.</exception>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="User"/> cannot be retrieved.
        /// </exception>
        public async Task<UserDto> GetUserByIdAsync(long userId)
        {
            if (!await UserExistsByIdAsync(userId))
                throw new NotFoundException($"User with ID: {userId}, was not found.");

            var existingUser = await _userRepository.GetUserByIdAsync(userId);

            if (existingUser == null)
                throw new NotRetrievedException($"User with ID: {userId}, was not retrieved successfully.");

            var existingUserDto = _mapper.Map<UserDto>(existingUser);

            return existingUserDto;
        }

        /// <summary>
        /// Authenticates a <see cref="User"/> based on their username and password.
        /// </summary>
        /// <param name="username">The username of the <see cref="User"/> attempting to authenticate.</param>
        /// <param name="password">The password provided by the <see cref="User"/> for authentication.</param>
        /// <returns>A task that represents the asynchronous operation, containing the authenticated <see cref="User"/> if successful.</returns>
        /// <exception cref="UnauthorizedAccessException">
        /// Thrown when the username or password is incorrect.
        /// </exception>
        public async Task<User> AuthenticateUserAsync(string username, string password)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
                throw new UnauthorizedAccessException("Username or Password was incorrect.");

            if (!BCrypt.Net.BCrypt.Verify(password, user.Password))
                throw new UnauthorizedAccessException("Username or Password was incorrect.");

            return user;
        }

        /// <summary>
        /// Registers a new <see cref="User"/> by adding the <see cref="User"/>'s details and creating a <see cref="Profile"/>.
        /// </summary>
        /// <param name="newRegisterDto">The <see cref="RegisterDto"/> object containing the <see cref="User"/>'s registration details.</param>
        /// <returns>
        /// A <see cref="UserDto"/> object representing the newly created <see cref="User"/>.
        /// </returns>
        /// <exception cref="UsernameAlreadyTakenException">
        /// Thrown when the username provided in <paramref name="newRegisterDto"/> is already taken.
        /// </exception>
        /// <exception cref="NotSavedException">
        /// Thrown when the <see cref="User"/> or <see cref="Profile"/> cannot be saved successfully.
        /// </exception>
        /// <exception cref="Exception">
        /// Thrown for any other unexpected errors during the registration process.
        /// </exception>
        public async Task<UserDto> AddUserAsync(RegisterDto newRegisterDto)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                if (await UsernameVerificationAsync(newRegisterDto.Username))
                        throw new UsernameAlreadyTakenException("The username is already taken.");
                    
                var newUser = _mapper.Map<User>(newRegisterDto);
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
                
                newUser.RoleId = DefaultUserId;
                newUser.Password = HashPassword("12345678");
                
                var createdUserEntity = await _userRepository.AddUserAsync(newUser);
                
                if (createdUserEntity == null || createdUserEntity.Id <= 0)
                    throw new NotSavedException($"{newUser.Username}, was not saved successfully");
                
                var newProfile = new ProfileDto
                {
                    UserId = createdUserEntity.Id
                };
                
                var createdProfileEntity = await _userprofileService.AddProfileAsync(newProfile);
                
                if (createdProfileEntity == null || createdProfileEntity.Id <= 0)
                    throw new NotSavedException($"An error occurred saving a profile for the new user.");

                await _unitOfWork.CommitAsync();

                var createdEntityDto = _mapper.Map<UserDto>(createdUserEntity);
                return createdEntityDto;

            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        /// <summary>
        /// Updates an existing <see cref="User"/>'s details in the system.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="User"/> to update.</param>
        /// <param name="updatedUserDto">The DTO containing the updated details of the <see cref="User"/>.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="User"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="User"/>'s details cannot be updated successfully.</exception>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="User"/> cannot be retrieved.
        /// </exception>
        public async Task UpdateUserAsync(long userId, UserDto updatedUserDto)
        {
            if (!await UserExistsByIdAsync(userId))
                throw new NotFoundException($"User with ID: {userId}, was not found.");

            //if (!await UsernameOwnerAsync(userId, updatedUserDto.Username))
            //    throw new UsernameAlreadyTakenException("The username is already taken.");

            var existingUser = await _userRepository.GetUserByIdAsync(userId);

            if (existingUser == null)
                throw new NotRetrievedException($"User with ID: {userId}, was not retrieved successfully.");

            var updatedUser = _mapper.Map<User>(updatedUserDto);

            if (!string.IsNullOrWhiteSpace(updatedUserDto.Password))
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(updatedUserDto.Password);
                existingUser.Password = HashPassword("12345678");
            }

            if (!string.IsNullOrWhiteSpace(updatedUserDto.Username))
                existingUser.Username = updatedUserDto.Username;

            var rowsAffected = await _userRepository.UpdateUserAsync(existingUser);

            if (rowsAffected <= 0)
                throw new NotSavedException($"User with ID: {userId}, was not updated succesfully");
        }

        /// <summary>
        /// Deletes an <see cref="User"/> by their unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="User"/> to be deleted.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="User"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when <see cref="User"/> was not deleted.</exception>
        public async Task DeleteUserByIdAsync(long userId)
        {
            if (!await UserExistsByIdAsync(userId))
                throw new NotFoundException($"User with ID: {userId}, was not found.");

            var userRowsAffected = await _userRepository.DeleteUserByIdAsync(userId);

            if (userRowsAffected <= 0)
                throw new NotSavedException($"User with ID: {userId}, was not deleted succesfully");
        }

        /// <summary>
        /// Checks whether an <see cref="User"/> exists in the repository by their unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="User"/> to check.</param>
        /// <returns>A task that represents the asynchronous operation, containing a boolean value indicating whether the <see cref="User"/> exists.</returns>
        public async Task<bool> UserExistsByIdAsync(long userId)
        {
            if (!await _userRepository.UserExistsByIdAsync(userId))
                return false;

            return true;
        }

        /// <summary>
        /// Checks whether a <see cref="User"/> username exists in the repository by their unique username in lowercase.
        /// </summary>
        /// <param name="username">The unique username of the <see cref="User"/> to check.</param>
        /// <returns>A task representing the asynchronous operation, containing a boolean value indicating whether the <see cref="User"/> usernameexists.</returns>
        public async Task<bool> UsernameVerificationAsync(string username)
        {
            string normalizedUsername = username.ToLower();

            if (!await _userRepository.UsernameExistsAsync(normalizedUsername))
                return false;

            return true;
        }
    }
}