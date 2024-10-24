using Haiku.API.Exceptions;
using Haiku.API.Models;
using Haiku.API.Repositories.RoleRepositories;

namespace Haiku.API.Services.RoleServices
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        /// <summary>
        /// Retrieves the <see cref="Role"/> associated with a specific <see cref="User"/>.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="User"/> whose <see cref="Role"/> is to be retrieved.</param>
        /// <returns>
        /// A <see cref="Role"/> object representing the <see cref="User"/>'s <see cref="Role"/>.
        /// </returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="Role"/> cannot be retrieved.
        /// </exception>
        public async Task<Role> GetRoleByUserIdAsync(long userId)
        {
            var role = await _roleRepository.GetRoleByUserIdAsync(userId);

            if (role == null)
                throw new NotRetrievedException("Role was not retrieved successfully.");

            return role;
        }
    }
}
