using AutoMapper;
using Haiku.API.Dtos;
using Haiku.API.Exceptions;
using Haiku.API.Models;
using Haiku.API.Repositories.AuthorRepositories;
using Haiku.API.Services.UnitOfWorkServices;

namespace Haiku.API.Services.AuthorServices
{
    public class AuthorService : IAuthorService
    {
        private readonly IAuthorRepository _authorRepository;
        private readonly IUnitOfWorkService _unitOfWork;
        private readonly IMapper _mapper;
        private const string DefaultBio = "No Bio";
        private const long DefaultAuthor = 1;

        public AuthorService(IAuthorRepository authorRepository, IUnitOfWorkService unitOfWork, IMapper mapper)
        {
            _authorRepository = authorRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="AuthorDto"/>, optionally filtered by a search term.
        /// </summary>
        /// <param name="pageNumber">The page number to retrieve (1-based index).</param>
        /// <param name="pageSize">The number of <see cref="Author"/> to return per page.</param>
        /// <param name="searchOption">An optional search term to filter <see cref="Author"/> by their properties.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an enumerable collection of <see cref="AuthorDto"/> objects.</returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="Author"/>'s cannot be retrieved.
        /// </exception>
        public async Task<IEnumerable<AuthorDto>> GetPaginatedAuthorsAsync(int pageNumber, int pageSize, string searchOption)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            var authors = await _authorRepository.GetPaginatedAuthorsAsync(pageNumber, pageSize, searchOption);

            if (authors == null)
                throw new NotRetrievedException($"Authors were not retrieved successfully.");

            var authorDtos = _mapper.Map<IEnumerable<AuthorDto>>(authors);
            return authorDtos;
        }

        /// <summary>
        /// Retrieves the total count of <see cref="Author"/>'s, optionally filtered by a search term.
        /// </summary>
        /// <param name="searchOption">An optional search term to filter the <see cref="Author"/>'s.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="Author"/>'s.</returns>
        public async Task<int> GetTotalAuthorsAsync(string searchOption)
        {
            return await _authorRepository.GetTotalAuthorsAsync(searchOption);
        }

        /// <summary>
        /// Retrieves an <see cref="Author"/> by their unique identifier.
        /// </summary>
        /// <param name="authorId">The unique identifier of the <see cref="Author"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the corresponding <see cref="AuthorDto"/>.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Author"/> with the specified ID is not found.</exception>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="Author"/> cannot be retrieved.
        /// </exception>
        public async Task<AuthorDto> GetAuthorByIdAsync(long authorId)
        {
            if (!await AuthorExistsByIdAsync(authorId))
                throw new NotFoundException($"Author with ID: {authorId}, was not found.");

            var existingAuthor = await _authorRepository.GetAuthorByIdAsync(authorId);

            if (existingAuthor == null)
                throw new NotRetrievedException($"Author with ID: {authorId}, was not retrieved successfully.");

            var existingAuthorDto = _mapper.Map<AuthorDto>(existingAuthor);

            return existingAuthorDto;
        }

        /// <summary>
        /// Adds a new author to the system.
        /// </summary>
        /// <param name="newAuthorDto">The DTO containing the details of the <see cref="Author"/> to add.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the corresponding <see cref="AuthorDto"/>.</returns>
        /// <exception cref="NotSavedException">Thrown when the <see cref="Author"/> cannot be saved successfully.</exception>
        public async Task<AuthorDto> AddAuthorAsync(AuthorDto newAuthorDto)
        {
            var newAuthor = _mapper.Map<Author>(newAuthorDto);
            newAuthor.Bio = string.IsNullOrWhiteSpace(newAuthor.Bio) ? DefaultBio : newAuthor.Bio;

            var createdEntity = await _authorRepository.AddAuthorAsync(newAuthor);

            if (createdEntity == null || createdEntity.Id <= 0)
                throw new NotSavedException($"{newAuthor.Name}, was not saved succesfully");

            var createdEntityDto = _mapper.Map<AuthorDto>(createdEntity);
            return createdEntityDto;
        }

        /// <summary>
        /// Updates an existing <see cref="Author"/>'s details in the system.
        /// </summary>
        /// <param name="authorId">The unique identifier of the <see cref="Author"/> to update.</param>
        /// <param name="updatedAuthorDto">The DTO containing the updated details of the <see cref="Author"/>.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Author"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="Author"/>'s details cannot be updated successfully.</exception>
        public async Task UpdateAuthorAsync(long authorId, AuthorDto updatedAuthorDto)
        {
            if (!await AuthorExistsByIdAsync(authorId))
                throw new NotFoundException($"Author with ID: {authorId}, was not found.");

            var updatedAuthor = _mapper.Map<Author>(updatedAuthorDto);

            updatedAuthor.Id = authorId;
            updatedAuthor.Bio = string.IsNullOrWhiteSpace(updatedAuthor.Bio) ? DefaultBio : updatedAuthor.Bio;
            var rowsAffected = await _authorRepository.UpdateAuthorAsync(updatedAuthor);

            if (rowsAffected <= 0)
                throw new NotSavedException($"{updatedAuthor.Name}, was not updated succesfully");
        }

        /// <summary>
        /// Deletes an <see cref="Author"/> by their unique identifier, along with handling their associated <see cref="AuthorHaiku"/>'s.
        /// </summary>
        /// <param name="authorId">The unique identifier of the <see cref="Author"/> to be deleted.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Author"/> with the specified ID is not found. Or Default <see cref="Author"/> is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when not all associated <see cref="AuthorHaiku"/>'s could be updated to the default <see cref="Author"/> or when <see cref="Author"/> was not deleted.</exception>
        public async Task DeleteAuthorByIdAsync(long authorId)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                if (!await _unitOfWork.Authors.AuthorExistsByIdAsync(authorId))
                    throw new NotFoundException($"Author with ID: {authorId}, was not found.");

                if (authorId == DefaultAuthor)
                    throw new InvalidOperationException("Default Author 'Unknown' can't be deleted.");

                var totalAuthorHaikus = await _unitOfWork.AuthorHaikus.GetTotalAuthorHaikusByAuthorIdAsync(authorId, "");

                if (totalAuthorHaikus >= 1)
                {
                    if (!await _unitOfWork.Authors.AuthorExistsByIdAsync(DefaultAuthor))
                        throw new NotFoundException($"The default Author 'Unknown' used for storing haikus without named authors was not found, cancelling operation.");

                    int rowAuthorAffected = await _unitOfWork.Authors.DeleteAuthorByIdAsync(authorId);

                    if (rowAuthorAffected <= 0)
                        throw new NotSavedException("Author was not deleted.");

                    int rowsAuthorHaikusAffected = await _unitOfWork.AuthorHaikus.UpdateAuthorHaikusToUnknownAuthorAsync(authorId, DefaultAuthor);

                    if (rowsAuthorHaikusAffected < totalAuthorHaikus)
                        throw new NotSavedException("Not all Author Haikus were stored, cancelling operation.");

                } else
                {
                    await _unitOfWork.Authors.DeleteAuthorByIdAsync(authorId);
                }
                await _unitOfWork.CompleteAsync();
                await _unitOfWork.CommitAsync();
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
            }
        }

        /// <summary>
        /// Checks whether an <see cref="Author"/> exists in the repository by their unique identifier.
        /// </summary>
        /// <param name="authorId">The unique identifier of the <see cref="Author"/> to check.</param>
        /// <returns>A task that represents the asynchronous operation, containing a boolean value indicating whether the <see cref="Author"/> exists.</returns>
        public async Task<bool> AuthorExistsByIdAsync(long authorId)
        {
            if (!await _authorRepository.AuthorExistsByIdAsync(authorId))
                return false;

            return true;
        }
    }
}
