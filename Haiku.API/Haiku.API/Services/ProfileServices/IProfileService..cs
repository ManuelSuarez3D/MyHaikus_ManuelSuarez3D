using Haiku.API.Dtos;

namespace Haiku.API.Services.IProfileServices
{
    public interface IProfileService
    {
        Task<IEnumerable<ProfileDto>> GetAllProfilesByUserIdsAsync(List<long> userIds);
        Task<int> GetTotalProfilesAsync();
        Task<ProfileDto> GetProfileByUserIdAsync(long userId);
        Task<ProfileDto> GetProfileByIdAsync(long profileId);
        Task<ProfileDto> AddProfileAsync(ProfileDto profile);
        Task UpdateProfileAsync(long profileId, ProfileDto existingProfile);
        Task<bool> ProfileExistsByIdAsync(long profileId);
    }
}
