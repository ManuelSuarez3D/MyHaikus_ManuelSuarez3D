using Haiku.API.Database;
using Haiku.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Haiku.API.Repositories.UserHaikuRepositories
{
    public class UserHaikuRepository : IUserHaikuRepository
    {
        private readonly HaikuAPIContext _context;

        public UserHaikuRepository(HaikuAPIContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="UserHaiku"/> entities.
        /// </summary>
        /// <param name="pageNumber">The number of the page to retrieve. Must be greater than zero.</param>
        /// <param name="pageSize">The number of items per page. Must be greater than zero.</param>
        /// <param name="searchOption">An optional search term to filter the <see cref="UserHaiku"/> by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a collection of <see cref="UserHaiku"/> entities.</returns>
        public async Task<IEnumerable<UserHaiku>> GetPaginatedUserHaikusAsync(int pageNumber, int pageSize, string searchOption)
        {
            IQueryable<UserHaiku> query = _context.UserHaikus;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(h => h.Title != null && h.Title.Contains(searchOption));
            }


            return await query
                .OrderBy(c => c.Id) 
                .Skip((pageNumber - 1) * pageSize) 
                .Take(pageSize)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="UserHaiku"/> entities by user ID.
        /// </summary>
        /// <param name="userId">The user identification to filter the <see cref="UserHaiku"/>.</param>
        /// <param name="pageNumber">The number of the page to retrieve. Must be greater than zero.</param>
        /// <param name="pageSize">The number of items per page. Must be greater than zero.</param>
        /// <param name="searchOption">An optional search term to filter the <see cref="UserHaiku"/> by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a collection of <see cref="UserHaiku"/> entities.</returns>
        public async Task<IEnumerable<UserHaiku>> GetPaginatedUserHaikusByUserIdAsync(long userId, int pageNumber, int pageSize, string searchOption)
        {
            IQueryable<UserHaiku> query = _context.UserHaikus;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(h => h.Title != null && h.Title.Contains(searchOption));
            }

            return await query
                .Where(h => h.UserId == userId)
                .OrderBy(c => c.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a collection of <see cref="UserHaiku"/> entities associated with a specified user ID for deletion purposes asynchronously.
        /// </summary>
        /// <param name="userId">The ID of the <see cref="User"/> whose haikus are to be retrieved.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="IEnumerable{UserHaiku}"/> collection of the <see cref="User"/>'s <see cref="UserHaiku"/>.</returns>
        public async Task<IEnumerable<UserHaiku>> GetUserHaikusByUserIdForDeleteAsync(long userId)
        {
            return await _context.UserHaikus
                .Where(h => h.UserId == userId)
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves the total count of <see cref="UserHaiku"/> entities in the database by the <see cref="User"/> identifier,
        /// optionally filtered by a search term for the title.
        /// </summary>
        /// <param name="userId">The user identification to filter the <see cref="UserHaiku"/>.</param>
        /// <param name="searchOption">An optional search term to filter the <see cref="UserHaiku"/> by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="UserHaiku"/> entities.</returns>
        public async Task<int> GetTotalUserHaikusByUserIdAsync(long userId, string searchOption)
        {
            IQueryable<UserHaiku> query = _context.UserHaikus;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(h => h.Title != null && h.Title.Contains(searchOption));
            }

            return await query.
                CountAsync(h => h.UserId == userId);
        }

        /// <summary>
        /// Retrieves the total count of <see cref="UserHaiku"/> entities in the database,
        /// optionally filtered by a search term for the title.
        /// </summary>
        /// <param name="searchOption">An optional search term to filter the <see cref="UserHaiku"/> by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="UserHaiku"/> entities.</returns>
        public async Task<int> GetTotalUserHaikusAsync(string searchOption)
        {
            IQueryable<UserHaiku> query = _context.UserHaikus;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(h => h.Title != null && h.Title.Contains(searchOption));
            }

            return await query.CountAsync();
        }

        /// <summary>
        /// Retrieves an <see cref="UserHaiku"/> entity by its unique identifier.
        /// </summary>
        /// <param name="authorHaikuId">The unique identifier of the <see cref="UserHaiku"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="UserHaiku"/> entity if found; otherwise, <c>null</c>.</returns>
        public async Task<UserHaiku?> GetUserHaikuByIdAsync(long haikuId)
        {
            return await _context.UserHaikus.FindAsync(haikuId);
        }

        /// <summary>
        /// Adds a new <see cref="UserHaiku"/> to the database asynchronously.
        /// </summary>
        /// <param name="newHaiku">The <see cref="UserHaiku"/> entity to be added.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the added <see cref="UserHaiku"/> entity.</returns>
        public async Task<UserHaiku> AddUserHaikuAsync(UserHaiku haiku)
        {
            var entity = await _context.UserHaikus.AddAsync(haiku);
            await _context.SaveChangesAsync();
            return entity.Entity;
        }

        /// <summary>
        /// Updates an existing <see cref="UserHaiku"/> in the database asynchronously.
        /// </summary>
        /// <param name="updatedUserHaiku">The <see cref="UserHaiku"/> entity with updated values.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the number of state entries written to the database.</returns>
        public async Task<int> UpdateUserHaikuAsync(UserHaiku updatedUserHaiku)
        {
            _context.UserHaikus.Attach(updatedUserHaiku);
            _context.Entry(updatedUserHaiku).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Deletes an <see cref="UserHaiku"/> entity by its ID asynchronously.
        /// </summary>
        /// <param name="userHaikuId">The ID of the <see cref="UserHaiku"/> entity to be deleted.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the number of affected rows in the database.</returns>
        public async Task<int> DeleteUserHaikuByIdAsync(long userHaikuId)
        {
            var userHaiku = await _context.UserHaikus.FindAsync(userHaikuId);

            if (userHaiku == null)
                return 0;

            _context.UserHaikus.Remove(userHaiku);
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Checks if an <see cref="UserHaiku"/> entity exists by its ID asynchronously.
        /// </summary>
        /// <param name="userHaikuId">The ID of the <see cref="UserHaiku"/> entity to check for existence.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="UserHaiku"/> exists.</returns>
        public async Task<bool> UserHaikuExistsByIdAsync(long userHaikuId)
        {
            return await _context.UserHaikus.AnyAsync(e => e.Id == userHaikuId);
        }
    }
}
