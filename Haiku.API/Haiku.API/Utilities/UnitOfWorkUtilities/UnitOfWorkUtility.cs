using Haiku.API.Repositories.AuthorHaikuRepositories;
using Haiku.API.Repositories.AuthorRepositories;
using Microsoft.EntityFrameworkCore.Storage;
using Haiku.API.Database;
using Haiku.API.Repositories.ProfileRepositories;
using Haiku.API.Repositories.UserRepositories;
using Haiku.API.Repositories.ImageRepositories;

namespace Haiku.API.Utilities.UnitOfWorkUtilities
{
    public class UnitOfWorkUtility : IUnitOfWorkUtility
    {
        private readonly HaikuAPIContext _context;
        private IDbContextTransaction _transaction;

        /// <summary>
        /// Initializes a new instance of the <see cref="UnitOfWorkUtility"/> class.
        /// </summary>
        /// <param name="context">The database context to be used for operations.</param>
        /// <param name="authors">The repository for managing authors.</param>
        /// <param name="authorHaikus">The repository for managing author haikus.</param>
        /// <param name="users">The repository for managing users.</param>
        /// <param name="userProfiles">The repository for managing user profiles.</param>
        public UnitOfWorkUtility(HaikuAPIContext context, IAuthorRepository authors, IAuthorHaikuRepository authorHaikus, IUserRepository users, IProfileRepository profiles, IImageRepository images)
        {
            _context = context;
            Authors = authors;
            AuthorHaikus = authorHaikus;
            Users = users;
            Profiles = profiles;
            Images = images;
        }

        /// <summary>
        /// Gets the repository for managing authors.
        /// </summary>
        public IAuthorRepository Authors { get; }

        /// <summary>
        /// Gets the repository for managing author haikus.
        /// </summary>
        public IAuthorHaikuRepository AuthorHaikus { get; }

        /// <summary>
        /// Gets the repository for managing users.
        /// </summary>
        public IUserRepository Users { get; }

        /// <summary>
        /// Gets the repository for managing user profiles.
        /// </summary>
        public IProfileRepository Profiles { get; }

        /// <summary>
        /// Gets the repository for managing images.
        /// </summary>
        public IImageRepository Images { get; }

        /// <summary>
        /// Begins a new database transaction asynchronously.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        /// <summary>
        /// Commits the current transaction asynchronously.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task CommitAsync()
        {
            await _transaction.CommitAsync();
        }

        /// <summary>
        /// Rolls back the current transaction asynchronously.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation.</returns>
        public async Task RollbackAsync()
        {
            await _transaction.RollbackAsync();
        }

        /// <summary>
        /// Saves all changes made in this unit of work asynchronously.
        /// </summary>
        /// <returns>The number of state entries written to the database.</returns>
        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Disposes the resources used by the <see cref="UnitOfWorkUtility"/> class.
        /// </summary>
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
