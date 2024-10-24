using Haiku.API.Models;

namespace Haiku.API.Repositories.UserRepositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetPaginatedUsersAsync(int pageNumber, int pageSize, string searchOption);
        Task<User?> GetUserByIdAsync(long userId);
        Task<int> GetTotalUsersAsync(string searchOption);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User> AddUserAsync(User newUser);
        Task<int> UpdateUserAsync(User updatedUser);
        Task<int> DeleteUserByIdAsync(long userId);
        Task<bool> UserExistsByIdAsync(long userId);
        Task<bool> UsernameExistsAsync(string normalizedUsername);
    }
}
