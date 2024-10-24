using Haiku.API.Models;

namespace Haiku.API.Services.RoleServices
{
    public interface IRoleService
    {
        Task<Role> GetRoleByUserIdAsync(long userId);
    }
}
