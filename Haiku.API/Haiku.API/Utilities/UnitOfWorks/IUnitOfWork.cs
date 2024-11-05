using Haiku.API.Repositories.AuthorHaikuRepositories;
using Haiku.API.Repositories.AuthorRepositories;
using Haiku.API.Repositories.ImageRepositories;
using Haiku.API.Repositories.ProfileRepositories;
using Haiku.API.Repositories.UserRepositories;

namespace Haiku.API.Utilities
{
    public interface IUnitOfWork : IDisposable
    {
        IAuthorRepository Authors { get; }
        IAuthorHaikuRepository AuthorHaikus { get; }
        IUserRepository Users { get; }
        IProfileRepository Profiles { get; }
        IImageRepository Images { get; }
        Task<int> CompleteAsync();
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}
