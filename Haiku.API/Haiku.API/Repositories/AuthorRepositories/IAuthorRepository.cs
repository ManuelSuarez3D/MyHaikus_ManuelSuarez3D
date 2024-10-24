using Haiku.API.Models;

namespace Haiku.API.Repositories.AuthorRepositories
{
    public interface IAuthorRepository
    {
        Task<IEnumerable<Author>> GetPaginatedAuthorsAsync(int pageNumber, int pageSize, string searchOption);
        Task<int> GetTotalAuthorsAsync(string searchOption);
        Task<Author?> GetAuthorByIdAsync(long authorId);
        Task<Author> AddAuthorAsync(Author newAuthor);
        Task<int> UpdateAuthorAsync(Author updatedAuthor);
        Task<int> DeleteAuthorByIdAsync(long authorId);
        Task<bool> AuthorExistsByIdAsync(long authorId);
    }
}
