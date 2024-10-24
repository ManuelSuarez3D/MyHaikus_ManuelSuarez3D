using Haiku.API.Database;
using Haiku.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Haiku.API.Repositories.AuthorRepositories
{
    public class AuthorRepository : IAuthorRepository
    {
        private readonly HaikuAPIContext _context;

        public AuthorRepository(HaikuAPIContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="Author"/> entities.
        /// </summary>
        /// <param name="pageNumber">The page number. Must be greater than 0.</param>
        /// <param name="pageSize">The number of Authors per page. Must be greater than 0.</param>
        /// <param name="searchOption">An optional search term to filter the <see cref="Author"/> entities by name.</param>
        /// <returns><see cref="IEnumerable{Author}"/> containing Authors, with pageSize amount per page. Returns an empty collection if no Authors are found.</returns>
        public async Task<IEnumerable<Author>> GetPaginatedAuthorsAsync(int pageNumber, int pageSize, string searchOption)
        {
            IQueryable<Author> query = _context.Authors;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(c => c.Name.Contains(searchOption));
            }

            return await query
                .OrderBy(c => c.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves the total count of <see cref="Author"/> entities in the database,
        /// optionally filtered by a search term for the name.
        /// </summary>
        /// <param name="searchOption">An optional search term to filter the <see cref="Author"/> entities by name.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="Author"/> entities.</returns>
        public async Task<int> GetTotalAuthorsAsync(string searchOption)
        {
            IQueryable<Author> query = _context.Authors;

            if (!string.IsNullOrEmpty(searchOption))
            {
                query = query.Where(c => c.Name.Contains(searchOption));
            }

            return await query.CountAsync();
        }

        /// <summary>
        /// Retrieves an <see cref="Author"/> entity by its unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="Author"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="Author"/> entity if found; otherwise, <c>null</c>.</returns>
        public async Task<Author?> GetAuthorByIdAsync(long authorId)
        {
            return await _context.Authors.FindAsync(authorId);
        }

        /// <summary>
        /// Adds a new <see cref="Author"/> to the database asynchronously.
        /// </summary>
        /// <param name="newAuthor">The <see cref="Author"/> entity to be added.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the added <see cref="Author"/> entity.</returns>
        public async Task<Author> AddAuthorAsync(Author newAuthor)
        {
            var newEntity = await _context.Authors.AddAsync(newAuthor);
            await _context.SaveChangesAsync();
            return newEntity.Entity;
        }

        /// <summary>
        /// Updates an existing <see cref="Author"/> entry.
        /// </summary>
        /// <param name="updatedAuthor">The <see cref="Author"/> entry to update. Must not be null.</param>
        /// <returns>Integer result indicating number of rows affected, if <see cref="Author"/> was updated.</returns>
        public async Task<int> UpdateAuthorAsync(Author updatedAuthor)
        {
            _context.Authors.Attach(updatedAuthor);
            _context.Entry(updatedAuthor).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Deletes an existing <see cref="Author"/> entry.
        /// </summary>
        /// <param name="authorId">The ID of the <see cref="Author"/> entry to delete.</param>
        /// <returns>Integer result indicating number of rows affected, if <see cref="Author"/> was deleted.</returns>
        public async Task<int> DeleteAuthorByIdAsync(long authorId)
        {
            var author = await _context.Authors.FindAsync(authorId);

            if (author == null)
                return 0;

            _context.Authors.Remove(author);
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Checks if an <see cref="Author"/> entity exists by its ID asynchronously.
        /// </summary>
        /// <param name="authorId">The ID of the <see cref="Author"/> entity to check for existence.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="Author"/> exists.</returns>
        public async Task<bool> AuthorExistsByIdAsync(long authorId)
        {
            return await _context.Authors.AnyAsync(e => e.Id == authorId);
        }
    }
}
