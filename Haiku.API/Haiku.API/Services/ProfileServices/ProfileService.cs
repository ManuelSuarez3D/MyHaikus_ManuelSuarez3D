using AutoMapper;
using Haiku.API.Dtos;
using Haiku.API.Exceptions;
using Haiku.API.Models;
using Haiku.API.Repositories.ProfileRepositories;
using Haiku.API.Repositories.UserRepositories;
using Haiku.API.Services.IProfileServices;

namespace Haiku.API.Services.ProfileServices
{
    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository _profileRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private const string DefaultBio = "No Bio";
        private const long DefaultImageId = 1;

        public ProfileService(IProfileRepository profileRepository, IUserRepository userRepository, IMapper mapper)
        {
            _profileRepository = profileRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="ProfileDto"/>'s based on the page number, page size, and optional search criteria.
        /// </summary>
        /// <param name="userIds">List of <see cref="User"/> ID's to fetch the <see cref="Profile"/>'s.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="IEnumerable{ProfileDto}"/> of paginated <see cref="ProfileDto"/>'s.</returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="Profile"/>'s cannot be retrieved.
        /// </exception>
        public async Task<IEnumerable<ProfileDto>> GetAllProfilesByUserIdsAsync(List<long> userIds)
        {
            var profiles = await _profileRepository.GetAllProfilesByUserIdsAsync(userIds);

            if (profiles == null)
                throw new NotRetrievedException($"Profiles were not retrieved successfully.");

            var profilesDtos = _mapper.Map<IEnumerable<ProfileDto>>(profiles);

            return profilesDtos;
        }

        /// <summary>
        /// Retrieves the total count of all <see cref="Profile"/>'s, optionally filtered by a search string.
        /// </summary>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the total number of <see cref="Profile"/>'s.
        /// </returns>
        public async Task<int> GetTotalProfilesAsync()
        {
            return await _profileRepository.GetTotalProfilesAsync();
        }

        /// <summary>
        /// Retrieves an <see cref="ProfileDto"/> by its unique identifier.
        /// </summary>
        /// <param name="profileId">The unique identifier of the <see cref="Profile"/> to retrieve.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the corresponding <see cref="ProfileDto"/>.
        /// </returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Profile"/> with the specified ID is not found.</exception>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="Profile"/> cannot be retrieved.
        /// </exception>
        public async Task<ProfileDto> GetProfileByIdAsync(long profileId)
        {
            if (!await ProfileExistsByIdAsync(profileId))
                throw new NotFoundException($"Profile with ID: {profileId}, was not found.");

            var existingProfile = await _profileRepository.GetProfileByIdAsync(profileId);

            if (existingProfile == null)
                throw new NotRetrievedException($"Profile with ID: {profileId}, was not retrieved successfully.");

            var existingProfileDto = _mapper.Map<ProfileDto>(existingProfile);

            return existingProfileDto;
        }

        /// <summary>
        /// Retrieves an <see cref="ProfileDto"/> by its unique <see cref="User"/> identifier.
        /// </summary>
        /// <param name="userId">The unique <see cref="User"/> identifier of the <see cref="Profile"/> to retrieve.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the corresponding <see cref="ProfileDto"/>.
        /// </returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="User"/> with the specified ID is not found.</exception>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="Profile"/> from the <see cref="User"/> cannot be retrieved.
        /// </exception>
        public async Task<ProfileDto> GetProfileByUserIdAsync(long userId)
        {
            if (!await _userRepository.UserExistsByIdAsync(userId))
                throw new NotFoundException($"User with ID: {userId}, was not found.");

            var existingProfile = await _profileRepository.GetProfileByUserIdAsync(userId);

            if (existingProfile == null)
                throw new NotRetrievedException($"Profile from User with ID: {userId}, was not retrieved successfully.");

            var existingProfileDto = _mapper.Map<ProfileDto>(existingProfile);

            return existingProfileDto;
        }

        /// <summary>
        /// Adds a new <see cref="Profile"/> to the repository.
        /// </summary>
        /// <param name="newProfileDto">The DTO containing the details of the <see cref="Profile"/> to add.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the created <see cref="ProfileDto"/>.
        /// </returns>
        /// <exception cref="NotSavedException">Thrown when the <see cref="Profile"/> could not be add.</exception>
        public async Task<ProfileDto> AddProfileAsync(ProfileDto newProfileDto)
        {
            var newProfile = _mapper.Map<Models.Profile>(newProfileDto);
            newProfile.Bio = string.IsNullOrWhiteSpace(newProfile.Bio) ? DefaultBio : newProfile.Bio;
            newProfile.ImageId = DefaultImageId;

            var createdEntity = await _profileRepository.AddProfileAsync(newProfile);

            if (createdEntity == null || createdEntity.Id <= 0)
                throw new NotSavedException($"User Profile, was not saved succesfully");

            var createdEntityDto = _mapper.Map<ProfileDto>(createdEntity);
            return createdEntityDto;
        }

        /// <summary>
        /// Updates an existing <see cref="Profile"/> in the repository.
        /// </summary>
        /// <param name="profileId">The ID of the <see cref="Profile"/> to update.</param>
        /// <param name="updatedProfileDto">The DTO containing the updated details of the <see cref="Profile"/>.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Profile"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="Profile"/> could not be updated.</exception>
        public async Task UpdateProfileAsync(long profileId, ProfileDto updatedProfileDto)
        {
            if (!await ProfileExistsByIdAsync(profileId))
                throw new NotFoundException($" User Profile with ID: {profileId}, was not found.");

            var updatedProfile = _mapper.Map<Models.Profile>(updatedProfileDto);

            updatedProfile.Id = profileId;
            updatedProfile.Bio = string.IsNullOrWhiteSpace(updatedProfile.Bio) ? DefaultBio : updatedProfile.Bio;

            var rowsAffected = await _profileRepository.UpdateProfileAsync(updatedProfile);

            if (rowsAffected <= 0)
                throw new NotSavedException($"User Profile, was not updated succesfully");
        }

        /// <summary>
        /// Checks if an <see cref="Profile"/> exists in the repository by its ID.
        /// </summary>
        /// <param name="profileId">The ID of the <see cref="Profile"/> to check.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="Profile"/> exists.</returns>
        public async Task<bool> ProfileExistsByIdAsync(long profileId)
        {
            if (!await _profileRepository.ProfileExistsByIdAsync(profileId))
                return false;

            return true;
        }
    }
}
