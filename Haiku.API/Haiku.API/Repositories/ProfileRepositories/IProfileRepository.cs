using Haiku.API.Models;

namespace Haiku.API.Repositories.ProfileRepositories
{
    public interface IProfileRepository
    {
        Task<IEnumerable<Profile>> GetAllProfilesByUserIdsAsync(List<long> userIds);
        Task<int> GetTotalProfilesAsync(); 
        Task<Profile?> GetProfileByUserIdAsync(long userId);
        Task<Profile?> GetProfileByIdAsync(long profileId);
        Task<Profile> AddProfileAsync(Profile profile);
        Task<int> UpdateProfileAsync(Profile profile);
        Task<bool> ProfileExistsByIdAsync(long profileId);
    }
}
