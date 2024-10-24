using Haiku.API.Models;

namespace Haiku.API.Repositories.RoleRepositories
{
    public interface IRoleRepository
    {
        Task<Role?> GetRoleByUserIdAsync(long userId);
    }
}
