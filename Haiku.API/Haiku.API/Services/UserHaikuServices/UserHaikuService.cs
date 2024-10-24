using AutoMapper;
using Haiku.API.Dtos;
using Haiku.API.Exceptions;
using Haiku.API.Models;
using Haiku.API.Repositories.UserHaikuRepositories;
using Haiku.API.Services.UserServices;

namespace Haiku.API.Services.UserHaikuServices
{
    public class UserHaikuService : IUserHaikuService
    {
        private readonly IUserHaikuRepository _userHaikuRepository;
        private readonly IUserService _userService;
        private readonly ILogger<UserHaikuService> _logger;
        private readonly IMapper _mapper;

        public UserHaikuService(IUserHaikuRepository userHaikuRepository, IUserService userService, ILogger<UserHaikuService> logger, IMapper mapper)
        {
            _userHaikuRepository = userHaikuRepository;
            _userService = userService; 
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="UserHaikuDto"/>'s based on the page number, page size, and optional search criteria.
        /// </summary>
        /// <param name="pageNumber">The current page number. Defaults to 1 if a value less than 1 is provided.</param>
        /// <param name="pageSize">The number of items per page.</param>
        /// <param name="searchOption">An optional search string to filter <see cref="UserHaiku"/>'s by their title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="IEnumerable{UserHaikuDto}"/> of paginated <see cref="UserHaiku"/>'s.</returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="UserHaiku"/>'s cannot be retrieved.
        /// </exception>
        public async Task<IEnumerable<UserHaikuDto>> GetPaginatedUserHaikusAsync(int pageNumber, int pageSize, string searchOption)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            var userHaikus = await _userHaikuRepository.GetPaginatedUserHaikusAsync(pageNumber, pageSize, searchOption);

            if (userHaikus == null)
                throw new NotRetrievedException($"User Haikus were not retrieved successfully.");

            var userHaikusDtos = _mapper.Map<IEnumerable<UserHaikuDto>>(userHaikus);
            return userHaikusDtos;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="UserHaikuDto"/>'s based on the <see cref="User"/>'s ID, page number, page size, and optional search criteria.
        /// </summary>
        /// <param name="userId">The ID of the <see cref="User"/> whose <see cref="UserHaiku"/>'s are being retrieved.</param>
        /// <param name="pageNumber">The current page number. Defaults to 1 if a value less than 1 is provided.</param>
        /// <param name="pageSize">The number of items per page.</param>
        /// <param name="searchOption">An optional search string to filter <see cref="UserHaiku"/>'s by their title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="IEnumerable{UserHaikuDto}"/> of paginated <see cref="UserHaiku"/>'s by the specified <see cref="User"/>.</returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="UserHaiku"/>'s cannot be retrieved.
        /// </exception>
        public async Task<IEnumerable<UserHaikuDto>> GetPaginatedUserHaikusByUserIdAsync(long userId, int pageNumber, int pageSize, string searchOption)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            var userHaikus = await _userHaikuRepository.GetPaginatedUserHaikusByUserIdAsync(userId, pageNumber, pageSize, searchOption);

            if (userHaikus == null)
                throw new NotRetrievedException($"User Haikus were not retrieved successfully.");

            var userHaikusDtos = _mapper.Map<IEnumerable<UserHaikuDto>>(userHaikus);
            return userHaikusDtos;
        }

        /// <summary>
        /// Retrieves the total count of <see cref="UserHaiku"/>'s associated with a specific <see cref="Author"/>, filtered by an optional search criteria.
        /// </summary>
        /// <param name="userId">The ID of the <see cref="User"/> whose <see cref="UserHaiku"/>'s are being counted.</param>
        /// <param name="searchOption">An optional search string to filter <see cref="UserHaiku"/>'s by their title.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the total number of <see cref="UserHaiku"/>'s  by the specified <see cref="User"/>.
        /// </returns>
        public async Task<int> GetTotalUserHaikusByUserIdAsync(long userId, string searchOption)
        {
            return await _userHaikuRepository.GetTotalUserHaikusByUserIdAsync(userId, searchOption);
        }

        /// <summary>
        /// Retrieves the total count of all <see cref="UserHaiku"/>'s, optionally filtered by a search string.
        /// </summary>
        /// <param name="searchOption">An optional search string to filter <see cref="UserHaiku"/>'s by their title.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the total number of <see cref="UserHaiku"/>'s.
        /// </returns>
        public async Task<int> GetTotalUserHaikusAsync(string searchOption)
        {
            return await _userHaikuRepository.GetTotalUserHaikusAsync(searchOption);
        }

        /// <summary>
        /// Retrieves an <see cref="UserHaikuDto"/> by its unique identifier.
        /// </summary>
        /// <param name="userHaikuId">The unique identifier of the <see cref="UserHaiku"/> to retrieve.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the corresponding <see cref="UserHaikuDto"/>.
        /// </returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="UserHaiku"/> with the specified ID is not found.</exception>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="UserHaiku"/>'s cannot be retrieved.
        /// </exception>
        public async Task<UserHaikuDto> GetUserHaikuByIdAsync(long userHaikuId)
        {
            if (!await UserHaikuExistsByIdAsync(userHaikuId))
                throw new NotFoundException($"User Haiku with ID: {userHaikuId}, was not found.");

            var existingUserHaiku = await _userHaikuRepository.GetUserHaikuByIdAsync(userHaikuId);

            if (existingUserHaiku == null)
                throw new NotRetrievedException($"User Haiku with ID: {userHaikuId}, was not retrieved successfully.");

            var existingUserHaikuDto = _mapper.Map<UserHaikuDto>(existingUserHaiku);

            return existingUserHaikuDto;
        }

        /// <summary>
        /// Adds a new <see cref="UserHaiku"/> to the repository.
        /// </summary>
        /// <param name="newUserHaikuDto">The DTO containing the details of the <see cref="UserHaiku"/> to add.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the created <see cref="UserHaikuDto"/>.
        /// </returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="User"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="UserHaiku"/> could be updated.</exception>
        public async Task<UserHaikuDto> AddUserHaikuAsync(UserHaikuDto newUserHaikuDto)
        {
            if (!await _userService.UserExistsByIdAsync(newUserHaikuDto.UserId))
                throw new NotFoundException($"User Haiku with ID: {newUserHaikuDto.UserId}, was not found.");

            var newUserHaiku = _mapper.Map<UserHaiku>(newUserHaikuDto);
            newUserHaiku.Title = string.IsNullOrWhiteSpace(newUserHaiku.Title) ? "Untitled" : newUserHaiku.Title;

            var createdEntity = await _userHaikuRepository.AddUserHaikuAsync(newUserHaiku);

            if (createdEntity == null || createdEntity.Id <= 0)
                throw new NotSavedException($"{newUserHaiku.Title}, was not saved succesfully");

            var createdEntityDto = _mapper.Map<UserHaikuDto>(createdEntity);
            return createdEntityDto;
        }

        /// <summary>
        /// Updates an existing <see cref="UserHaiku"/> in the repository.
        /// </summary>
        /// <param name="userHaikuId">The ID of the <see cref="UserHaiku"/> to update.</param>
        /// <param name="updatedUserHaikuDto">The DTO containing the updated details of the <see cref="UserHaiku"/>.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="UserHaiku"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="UserHaiku"/> could not be updated.</exception>
        public async Task UpdateUserHaikuAsync(long userHaikuId, UserHaikuDto updatedUserHaikuDto)
        {
            if (!await UserHaikuExistsByIdAsync(userHaikuId))
                throw new NotFoundException($"User Haiku with ID: {userHaikuId}, was not found.");

            var updatedUserHaiku = _mapper.Map<UserHaiku>(updatedUserHaikuDto);

            updatedUserHaiku.Id = userHaikuId;
            updatedUserHaiku.Title = string.IsNullOrWhiteSpace(updatedUserHaiku.Title) ? "Untitled" : updatedUserHaiku.Title;
            var rowsAffected = await _userHaikuRepository.UpdateUserHaikuAsync(updatedUserHaiku);

            if (rowsAffected <= 0)
                throw new NotSavedException($"{updatedUserHaiku.Title}, was not updated succesfully");
        }

        /// <summary>
        /// Deletes an <see cref="UserHaiku"/> from the repository by its ID.
        /// </summary>
        /// <param name="userHaikuId">The ID of the <see cref="UserHaiku"/> to delete.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="UserHaiku"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="UserHaiku"/> could not be deleted.</exception>
        public async Task DeleteUserHaikuByIdAsync(long userHaikuId)
        {
            if (!await UserHaikuExistsByIdAsync(userHaikuId))
                throw new NotFoundException($"User Haiku with ID: {userHaikuId}, was not found.");

            var userRowsAffected = await _userHaikuRepository.DeleteUserHaikuByIdAsync(userHaikuId);

            if (userRowsAffected <= 0)
                throw new NotSavedException($"User Haiku with ID: {userHaikuId}, was not deleted succesfully");

        }

        /// <summary>
        /// Checks if an <see cref="UserHaiku"/> exists in the repository by its ID.
        /// </summary>
        /// <param name="userHaikuId">The ID of the <see cref="UserHaiku"/> to check.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="UserHaiku"/> exists.</returns>
        public async Task<bool> UserHaikuExistsByIdAsync(long userHaikuId)
        {
            if (!await _userHaikuRepository.UserHaikuExistsByIdAsync(userHaikuId))
                return false;

            return true;
        }
    }
}
