using Haiku.API.Models;

namespace Haiku.API.Repositories.UserHaikuRepositories
{
    public interface IUserHaikuRepository
    {
        Task<IEnumerable<UserHaiku>> GetPaginatedUserHaikusAsync(int pageNumber, int pageSize, string searchOption);
        Task<IEnumerable<UserHaiku>> GetPaginatedUserHaikusByUserIdAsync(long userId, int pageNumber, int pageSize, string searchOption);
        Task<IEnumerable<UserHaiku>> GetUserHaikusByUserIdForDeleteAsync(long userId);
        Task<int> GetTotalUserHaikusByUserIdAsync(long userId, string searchOption);
        Task<int> GetTotalUserHaikusAsync(string searchOption);
        Task<UserHaiku?> GetUserHaikuByIdAsync(long UserHaikuId);
        Task<UserHaiku> AddUserHaikuAsync(UserHaiku UserHaiku);
        Task<int> UpdateUserHaikuAsync(UserHaiku UserHaiku);
        Task<int> DeleteUserHaikuByIdAsync(long UserHaikuId);
        Task<bool> UserHaikuExistsByIdAsync(long UserHaikuId);
    }
}
