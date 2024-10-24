using Haiku.API.Models;

namespace Haiku.API.Repositories.AuthorHaikuRepositories
{
    public interface IAuthorHaikuRepository
    {
        Task<IEnumerable<AuthorHaiku>> GetPaginatedAuthorHaikusAsync(int pageNumber, int pageSize, string searchOption);
        Task<IEnumerable<AuthorHaiku>> GetPaginatedAuthorHaikusByAuthorIdAsync(long authorId, int pageNumber, int pageSize, string searchOption);
        Task<int> GetTotalAuthorHaikusByAuthorIdAsync(long authorId, string searchOption);
        Task<int> GetTotalAuthorHaikusAsync(string searchOption);
        Task<AuthorHaiku?> GetAuthorHaikuByIdAsync(long AuthorHaikuId);
        Task<AuthorHaiku> AddAuthorHaikuAsync(AuthorHaiku AuthorHaiku);
        Task<int> UpdateAuthorHaikuAsync(AuthorHaiku AuthorHaiku);
        Task<int> UpdateAuthorHaikusToUnknownAuthorAsync(long oldAuthorId, long newAuthorId);
        Task<int> DeleteAuthorHaikuByIdAsync(long AuthorHaikuId);
        Task<bool> AuthorHaikuExistsByIdAsync(long AuthorHaikuId);
    }
}
