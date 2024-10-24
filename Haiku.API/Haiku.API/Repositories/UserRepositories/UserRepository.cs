using Haiku.API.Database;
using Haiku.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Haiku.API.Repositories.UserRepositories
{
    public class UserRepository : IUserRepository
    {
        private readonly HaikuAPIContext _context;

        public UserRepository(HaikuAPIContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="User"/> entities.
        /// </summary>
        /// <param name="pageNumber">The number of the page to retrieve. Must be greater than zero.</param>
        /// <param name="pageSize">The number of items per page. Must be greater than zero.</param>
        /// <param name="searchOption">An optional search term to filter the <see cref="User"/> entities by username.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a collection of <see cref="User"/> entities.</returns>
        public async Task<IEnumerable<User>> GetPaginatedUsersAsync(int pageNumber, int pageSize, string searchOption)
        {
            IQueryable<User> query = _context.Users;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(c => c.Username.Contains(searchOption));
            }

            return await query 
                .OrderBy(c => c.Id) 
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves the total count of <see cref="User"/> entities in the database,
        /// optionally filtered by a search term for the title.
        /// </summary>
        /// <param name="searchOption">An optional search term to filter the <see cref="User"/> entities by username.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="User"/> entities.</returns>
        public async Task<int> GetTotalUsersAsync(string searchOption)
        {
            IQueryable<User> query = _context.Users;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(c => c.Username.Contains(searchOption));
            }

            return await query.CountAsync();
        }

        /// <summary>
        /// Retrieves an <see cref="User"/> entity by its unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="User"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="User"/> entity if found; otherwise, <c>null</c>.</returns>
        public async Task<User?> GetUserByIdAsync(long userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        /// <summary>
        /// Retrieves an <see cref="User"/> entity by its unique username.
        /// </summary>
        /// <param name="username">The unique username of the <see cref="User"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="User"/> entity if found; otherwise, <c>null</c>.</returns>
        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
        }

        /// <summary>
        /// Adds a new <see cref="User"/> to the database asynchronously.
        /// </summary>
        /// <param name="newUser">The <see cref="User"/> entity to be added.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the added <see cref="User"/> entity.</returns>
        public async Task<User> AddUserAsync(User newUser)
        {
            var newEntity = await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();
            return newEntity.Entity;
        }

        /// <summary>
        /// Updates an existing <see cref="User"/> entry.
        /// </summary>
        /// <param name="updatedUser">The <see cref="User"/> entry to update. Must not be null.</param>
        /// <returns>Integer result indicating number of rows affected, if <see cref="User"/> was updated.</returns>
        public async Task<int> UpdateUserAsync(User updatedUser)
        {
            _context.Users.Attach(updatedUser);
            _context.Entry(updatedUser).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Deletes an existing <see cref="User"/> entry.
        /// </summary>
        /// <param name="authorId">The ID of the <see cref="User"/> entry to delete.</param>
        /// <returns>Integer result indicating number of rows affected, if <see cref="User"/> was deleted.</returns>
        public async Task<int> DeleteUserByIdAsync(long userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return 0;

            _context.Users.Remove(user);
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Checks if an <see cref="User"/> entity exists by its ID asynchronously.
        /// </summary>
        /// <param name="userId">The ID of the <see cref="User"/> entity to check for existence.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="User"/> exists.</returns>
        public async Task<bool> UserExistsByIdAsync(long userId)
        {
            return await _context.Users.AnyAsync(e => e.Id == userId);
        }

        /// <summary>
        /// Checks if a <see cref="User"/> entity exists by its unique username in lowercase.
        /// </summary>
        /// <param name="username">The unique username to check for existence.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="User"/> exists.</returns>
        public async Task<bool> UsernameExistsAsync(string normalizedUsername)
        {
            return await _context.Users
                .AnyAsync(u => u.Username.ToLower() == normalizedUsername);
        }
    }
}
