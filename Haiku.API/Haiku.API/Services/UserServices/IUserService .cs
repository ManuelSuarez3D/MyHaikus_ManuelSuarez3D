using Haiku.API.Dtos;
using Haiku.API.Models;

namespace Haiku.API.Services.UserServices
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetPaginatedUsersAsync(int pageNumber, int pageSize, string searchOption);
        Task<int> GetTotalUsersAsync(string searchOption);
        Task<UserDto> GetUserByIdAsync(long userId);
        Task<User> AuthenticateUserAsync(string username, string password);
        Task<UserDto> AddUserAsync(RegisterDto newRegisterDto);
        Task UpdateUserAsync(long userId, UserDto updatedUserDto);
        Task DeleteUserByIdAsync(long userId);
        Task<bool> UserExistsByIdAsync(long userId);
        Task<bool> UsernameVerificationAsync(string username);
    }
}
