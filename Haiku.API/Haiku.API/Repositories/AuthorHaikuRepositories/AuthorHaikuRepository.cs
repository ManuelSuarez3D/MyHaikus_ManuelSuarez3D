using Haiku.API.Database;
using Haiku.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Haiku.API.Repositories.AuthorHaikuRepositories
{
    public class AuthorHaikuRepository : IAuthorHaikuRepository
    {
        private readonly HaikuAPIContext _context;

        public AuthorHaikuRepository(HaikuAPIContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="AuthorHaiku"/> entities.
        /// </summary>
        /// <param name="pageNumber">The number of the page to retrieve. Must be greater than zero.</param>
        /// <param name="pageSize">The number of items per page. Must be greater than zero.</param>
        /// <param name="searchOption">An optional search term to filter the haikus by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a collection of <see cref="AuthorHaiku"/> entities.</returns>
        public async Task<IEnumerable<AuthorHaiku>> GetPaginatedAuthorHaikusAsync(int pageNumber, int pageSize, string searchOption)
        {
            IQueryable<AuthorHaiku> query = _context.AuthorHaikus;

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
        /// Retrieves a paginated list of <see cref="AuthorHaiku"/> entities for a specific author.
        /// </summary>
        /// <param name="authorId">The ID of the author whose haikus are to be retrieved. Must be a valid identifier.</param>
        /// <param name="pageNumber">The number of the page to retrieve. Must be greater than zero.</param>
        /// <param name="pageSize">The number of items per page. Must be greater than zero.</param>
        /// <param name="searchOption">An optional search term to filter the haikus by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a collection of <see cref="AuthorHaiku"/> entities.</returns>
        public async Task<IEnumerable<AuthorHaiku>> GetPaginatedAuthorHaikusByAuthorIdAsync(long authorId, int pageNumber, int pageSize, string searchOption)
        {
            IQueryable<AuthorHaiku> query = _context.AuthorHaikus;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(h => h.Title != null && h.Title.Contains(searchOption)); 
            }

            return await query
                .Where(h => h.AuthorId == authorId)
                .OrderBy(c => c.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves the total count of <see cref="AuthorHaiku"/> entities associated with a specific author,
        /// optionally filtered by a search term for the title.
        /// </summary>
        /// <param name="authorId">The ID of the author whose haikus are being counted. Must be a valid identifier.</param>
        /// <param name="searchOption">An optional search term to filter the haikus by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="AuthorHaiku"/> entities.</returns>
        public async Task<int> GetTotalAuthorHaikusByAuthorIdAsync(long authorId, string searchOption)
        {
            IQueryable<AuthorHaiku> query = _context.AuthorHaikus;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(h => h.Title != null && h.Title.Contains(searchOption));
            }

            return await query.
                CountAsync(h => h.AuthorId == authorId);
        }

        /// <summary>
        /// Retrieves the total count of <see cref="AuthorHaiku"/> entities in the database,
        /// optionally filtered by a search term for the title.
        /// </summary>
        /// <param name="searchOption">An optional search term to filter the haikus by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="AuthorHaiku"/> entities.</returns>
        public async Task<int> GetTotalAuthorHaikusAsync(string searchOption)
        {
            IQueryable<AuthorHaiku> query = _context.AuthorHaikus;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(h => h.Title != null && h.Title.Contains(searchOption));
            }

            return await query.CountAsync();
        }

        /// <summary>
        /// Retrieves an <see cref="AuthorHaiku"/> entity by its unique identifier.
        /// </summary>
        /// <param name="authorHaikuId">The unique identifier of the <see cref="AuthorHaiku"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="AuthorHaiku"/> entity if found; otherwise, <c>null</c>.</returns>
        public async Task<AuthorHaiku?> GetAuthorHaikuByIdAsync(long authorHaikuId)
        {
            return await _context.AuthorHaikus.FindAsync(authorHaikuId);
        }

        /// <summary>
        /// Adds a new <see cref="AuthorHaiku"/> to the database asynchronously.
        /// </summary>
        /// <param name="newHaiku">The <see cref="AuthorHaiku"/> entity to be added.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the added <see cref="AuthorHaiku"/> entity.</returns>
        public async Task<AuthorHaiku> AddAuthorHaikuAsync(AuthorHaiku newHaiku)
        {
            var entity = await _context.AuthorHaikus.AddAsync(newHaiku);
            await _context.SaveChangesAsync();
            return entity.Entity;
        }

        /// <summary>
        /// Updates an existing <see cref="AuthorHaiku"/> in the database asynchronously.
        /// </summary>
        /// <param name="updatedAuthorHaiku">The <see cref="AuthorHaiku"/> entity with updated values.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the number of state entries written to the database.</returns>
        public async Task<int> UpdateAuthorHaikuAsync(AuthorHaiku updatedAuthorHaiku)
        {
            _context.AuthorHaikus.Attach(updatedAuthorHaiku);
            _context.Entry(updatedAuthorHaiku).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Updates the author ID of <see cref="AuthorHaiku"/> entities that have a specific old author ID 
        /// or are currently associated with an unknown author (null) to a new author ID asynchronously.
        /// </summary>
        /// <param name="oldAuthorId">The ID of the author whose haikus are being updated.</param>
        /// <param name="newAuthorId">The ID of the new author to associate with the haikus.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the number of affected rows in the database.</returns>
        public async Task<int> UpdateAuthorHaikusToUnknownAuthorAsync(long oldAuthorId, long newAuthorId)
        {
            var affectedRows = await _context.AuthorHaikus
                .Where(authorHaiku => authorHaiku.AuthorId == oldAuthorId || authorHaiku.AuthorId == null)
                .ExecuteUpdateAsync(s => s.SetProperty(h => h.AuthorId, newAuthorId));

            await _context.SaveChangesAsync();
            return affectedRows;
        }

        /// <summary>
        /// Deletes an <see cref="AuthorHaiku"/> entity by its ID asynchronously.
        /// </summary>
        /// <param name="authorHaikuId">The ID of the <see cref="AuthorHaiku"/> entity to be deleted.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the number of affected rows in the database.</returns>
        public async Task<int> DeleteAuthorHaikuByIdAsync(long authorHaikuId)
        {
            var authorHaiku = await _context.AuthorHaikus.FindAsync(authorHaikuId);

            if (authorHaiku == null)
                return 0;
   
            _context.AuthorHaikus.Remove(authorHaiku);
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Checks if an <see cref="AuthorHaiku"/> entity exists by its ID asynchronously.
        /// </summary>
        /// <param name="authorHaikuId">The ID of the <see cref="AuthorHaiku"/> entity to check for existence.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="AuthorHaiku"/> exists.</returns>
        public async Task<bool> AuthorHaikuExistsByIdAsync(long authorHaikuId)
        {
            return await _context.AuthorHaikus.AnyAsync(e => e.Id == authorHaikuId);
        }
    }
}
