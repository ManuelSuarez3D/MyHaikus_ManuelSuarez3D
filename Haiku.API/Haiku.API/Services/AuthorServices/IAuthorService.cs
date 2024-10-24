using Haiku.API.Dtos;

namespace Haiku.API.Services.AuthorServices
{
    public interface IAuthorService
    {
        Task<IEnumerable<AuthorDto>> GetPaginatedAuthorsAsync(int pageNumber, int pageSize, string searchOption);
        Task<int> GetTotalAuthorsAsync(string searchOption);
        Task<AuthorDto> GetAuthorByIdAsync(long authorId);
        Task<AuthorDto> AddAuthorAsync(AuthorDto author);
        Task UpdateAuthorAsync(long authorId, AuthorDto existingAuthor);
        Task DeleteAuthorByIdAsync(long authorId);
        Task<bool> AuthorExistsByIdAsync(long authorId);
    }
}
