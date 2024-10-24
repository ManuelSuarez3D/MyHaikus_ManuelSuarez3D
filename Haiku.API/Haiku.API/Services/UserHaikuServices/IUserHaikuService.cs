using Haiku.API.Dtos;

namespace Haiku.API.Services.UserHaikuServices
{
    public interface IUserHaikuService
    {
        Task<IEnumerable<UserHaikuDto>> GetPaginatedUserHaikusAsync(int pageNumber, int pageSize, string searchOption);
        Task<IEnumerable<UserHaikuDto>> GetPaginatedUserHaikusByUserIdAsync(long userId, int pageNumber, int pageSize, string searchOption);
        Task<int> GetTotalUserHaikusByUserIdAsync(long userId, string searchOption);
        Task<int> GetTotalUserHaikusAsync(string searchOption);
        Task<UserHaikuDto> GetUserHaikuByIdAsync(long userHaikuId);
        Task<UserHaikuDto> AddUserHaikuAsync(UserHaikuDto userHaiku);
        Task UpdateUserHaikuAsync(long userHaikuId, UserHaikuDto existingUserHaiku);
        Task DeleteUserHaikuByIdAsync(long userHaikuId);
        Task<bool> UserHaikuExistsByIdAsync(long userHaikuId);
    }
}
