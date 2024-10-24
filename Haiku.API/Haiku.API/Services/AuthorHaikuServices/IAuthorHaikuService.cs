using Haiku.API.Dtos;

namespace Haiku.API.Services.AuthorHaikuServices
{
    public interface IAuthorHaikuService
    {
        Task<IEnumerable<AuthorHaikuDto>> GetPaginatedAuthorHaikusAsync(int pageNumber, int pageSize, string searchOption);
        Task<IEnumerable<AuthorHaikuDto>> GetPaginatedAuthorHaikusByAuthorIdAsync(long authorId, int pageNumber, int pageSize, string searchOption);
        Task<int> GetTotalAuthorHaikusByAuthorIdAsync(long authorId, string searchOption);
        Task<int> GetTotalAuthorHaikusAsync(string searchOption);
        Task<AuthorHaikuDto> GetAuthorHaikuByIdAsync(long authorHaikuId);
        Task<AuthorHaikuDto> AddAuthorHaikuAsync(AuthorHaikuDto authorHaiku);
        Task UpdateAuthorHaikuAsync(long authorHaikuId, AuthorHaikuDto existingAuthorHaiku);
        Task DeleteAuthorHaikuByIdAsync(long authorHaikuId);
        Task<bool> AuthorHaikuExistsByIdAsync(long authorHaikuId);
    }
}
