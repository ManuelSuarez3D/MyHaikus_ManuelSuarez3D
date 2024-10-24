using Haiku.API.Database;
using Haiku.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Haiku.API.Repositories.RoleRepositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly HaikuAPIContext _context;

        public RoleRepository(HaikuAPIContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves the <see cref="Role"/> of a <see cref="User"/> asynchronously based on the provided <see cref="User"/> ID.
        /// </summary>
        /// <param name="userId">The ID of the <see cref="User"/> whose <see cref="Role"/> is to be retrieved.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the <see cref="Role"/> of the <see cref="User"/>, 
        /// or <c>null</c> if the <see cref="User"/> or their <see cref="Role"/> does not exist.
        /// </returns>
        public async Task<Role?> GetRoleByUserIdAsync(long userId)
        {
            var user = await _context.Users.Include(u => u.UserRole).FirstOrDefaultAsync(u => u.Id == userId);
            return user?.UserRole;
        }
    }
}
