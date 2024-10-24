using AutoMapper;
using Haiku.API.Dtos;
using Haiku.API.Exceptions;
using Haiku.API.Models;
using Haiku.API.Repositories.AuthorHaikuRepositories;
using Haiku.API.Services.AuthorServices;

namespace Haiku.API.Services.AuthorHaikuServices
{
    public class AuthorHaikuService : IAuthorHaikuService
    {
        private readonly IAuthorHaikuRepository _authorHaikuRepository;
        private readonly IAuthorService _authorService;
        private readonly ILogger<AuthorHaikuService> _logger;
        private readonly IMapper _mapper;
        private const string DefaultTitle = "Untitled";

        public AuthorHaikuService(IAuthorHaikuRepository authorHaikuRepository, IAuthorService authorService, ILogger<AuthorHaikuService> logger, IMapper mapper)
        {
            _authorHaikuRepository = authorHaikuRepository;
            _authorService = authorService;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="AuthorHaikuDto"/>'s based on the page number, page size, and optional search criteria.
        /// </summary>
        /// <param name="pageNumber">The current page number. Defaults to 1 if a value less than 1 is provided.</param>
        /// <param name="pageSize">The number of items per page.</param>
        /// <param name="searchOption">An optional search string to filter <see cref="AuthorHaiku"/>'s by their title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="IEnumerable{AuthorHaikuDto}"/> of paginated <see cref="AuthorHaiku"/>'s.</returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="AuthorHaiku"/>'s cannot be retrieved.
        /// </exception>
        public async Task<IEnumerable<AuthorHaikuDto>> GetPaginatedAuthorHaikusAsync(int pageNumber, int pageSize, string searchOption)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            var authorHaikus = await _authorHaikuRepository.GetPaginatedAuthorHaikusAsync(pageNumber, pageSize, searchOption);

            if (authorHaikus == null)
                throw new NotRetrievedException($"Author Haikus were not retrieved successfully.");

            var authorHaikusDtos = _mapper.Map<IEnumerable<AuthorHaikuDto>>(authorHaikus);
            return authorHaikusDtos;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="AuthorHaikuDto"/>'s based on the <see cref="Author"/>'s ID, page number, page size, and optional search criteria.
        /// </summary>
        /// <param name="authorId">The ID of the <see cref="Author"/> whose <see cref="AuthorHaiku"/>'s are being retrieved.</param>
        /// <param name="pageNumber">The current page number. Defaults to 1 if a value less than 1 is provided.</param>
        /// <param name="pageSize">The number of items per page.</param>
        /// <param name="searchOption">An optional search string to filter <see cref="AuthorHaiku"/>'s by their title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an <see cref="IEnumerable{AuthorHaikuDto}"/> of paginated <see cref="AuthorHaiku"/>'s by the specified <see cref="Author"/>.</returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="AuthorHaiku"/>'s cannot be retrieved.
        /// </exception>
        public async Task<IEnumerable<AuthorHaikuDto>> GetPaginatedAuthorHaikusByAuthorIdAsync(long authorId, int pageNumber, int pageSize, string searchOption)
        {
             if (pageNumber < 1)
                 pageNumber = 1;

             var authorHaikus = await _authorHaikuRepository.GetPaginatedAuthorHaikusByAuthorIdAsync(authorId, pageNumber, pageSize, searchOption);

            if (authorHaikus == null)
                throw new NotRetrievedException($"Author Haikus were not retrieved successfully.");

            var authorHaikusDtos = _mapper.Map<IEnumerable<AuthorHaikuDto>>(authorHaikus);
             return authorHaikusDtos;
        }

        /// <summary>
        /// Retrieves the total count of <see cref="AuthorHaiku"/>'s associated with a specific <see cref="Author"/>, filtered by an optional search criteria.
        /// </summary>
        /// <param name="authorId">The ID of the <see cref="Author"/> whose <see cref="AuthorHaiku"/>'s are being counted.</param>
        /// <param name="searchOption">An optional search string to filter <see cref="AuthorHaiku"/>'s by their title.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the total number of <see cref="AuthorHaiku"/>'s  by the specified <see cref="Author"/>.
        /// </returns>
        public async Task<int> GetTotalAuthorHaikusByAuthorIdAsync(long authorId, string searchOption)
        {
            return await _authorHaikuRepository.GetTotalAuthorHaikusByAuthorIdAsync(authorId, searchOption);
        }

        /// <summary>
        /// Retrieves the total count of all <see cref="AuthorHaiku"/>'s, optionally filtered by a search string.
        /// </summary>
        /// <param name="searchOption">An optional search string to filter <see cref="AuthorHaiku"/>'s by their title.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the total number of <see cref="AuthorHaiku"/>'s.
        /// </returns>
        public async Task<int> GetTotalAuthorHaikusAsync(string searchOption)
        {
            return await _authorHaikuRepository.GetTotalAuthorHaikusAsync(searchOption);
        }

        /// <summary>
        /// Retrieves an <see cref="AuthorHaikuDto"/> by its unique identifier.
        /// </summary>
        /// <param name="authorHaikuId">The unique identifier of the <see cref="AuthorHaiku"/> to retrieve.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the corresponding <see cref="AuthorHaikuDto"/>.
        /// </returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="AuthorHaiku"/> with the specified ID is not found.</exception>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="AuthorHaiku"/> cannot be retrieved.
        /// </exception>
        public async Task<AuthorHaikuDto> GetAuthorHaikuByIdAsync(long authorHaikuId)
        {
            if (!await AuthorHaikuExistsByIdAsync(authorHaikuId))
                throw new NotFoundException($"Author Haiku with ID: {authorHaikuId}, was not found.");

            var existingAuthorHaiku = await _authorHaikuRepository.GetAuthorHaikuByIdAsync(authorHaikuId);

            if (existingAuthorHaiku == null)
                throw new NotRetrievedException($"Author Haiku with ID: {authorHaikuId}, was not retrieved successfully.");

            var existingAuthorHaikuDto = _mapper.Map<AuthorHaikuDto>(existingAuthorHaiku);

            return existingAuthorHaikuDto;
        }

        /// <summary>
        /// Adds a new <see cref="AuthorHaiku"/> to the repository.
        /// </summary>
        /// <param name="newAuthorHaikuDto">The DTO containing the details of the <see cref="AuthorHaiku"/> to add.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains the created <see cref="AuthorHaikuDto"/>.
        /// </returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Author"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="AuthorHaiku"/> could not be add.</exception>
        public async Task<AuthorHaikuDto> AddAuthorHaikuAsync(AuthorHaikuDto newAuthorHaikuDto)
        {
            if (!await _authorService.AuthorExistsByIdAsync(newAuthorHaikuDto.AuthorId))
                throw new NotFoundException($"Author with ID: {newAuthorHaikuDto.AuthorId}, was not found.");

            var newAuthorHaiku = _mapper.Map<AuthorHaiku>(newAuthorHaikuDto);
            newAuthorHaiku.Title = string.IsNullOrWhiteSpace(newAuthorHaiku.Title) ? DefaultTitle : newAuthorHaiku.Title;

            var createdEntity = await _authorHaikuRepository.AddAuthorHaikuAsync(newAuthorHaiku);

            if (createdEntity == null || createdEntity.Id <= 0)
                throw new NotSavedException($"{newAuthorHaiku.Title}, was not saved succesfully");

            var createdEntityDto = _mapper.Map<AuthorHaikuDto>(createdEntity);
            return createdEntityDto;
        }

        /// <summary>
        /// Updates an existing <see cref="AuthorHaiku"/> in the repository.
        /// </summary>
        /// <param name="authorHaikuId">The ID of the <see cref="AuthorHaiku"/> to update.</param>
        /// <param name="updatedAuthorHaikuDto">The DTO containing the updated details of the <see cref="AuthorHaiku"/>.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="AuthorHaiku"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="AuthorHaiku"/> could not be updated.</exception>
        public async Task UpdateAuthorHaikuAsync(long authorHaikuId, AuthorHaikuDto updatedAuthorHaikuDto)
        {
            if (!await AuthorHaikuExistsByIdAsync(authorHaikuId))
                throw new NotFoundException($"Author Haiku with ID: {authorHaikuId}, was not found.");

            var updatedAuthorHaiku = _mapper.Map<AuthorHaiku>(updatedAuthorHaikuDto);

            updatedAuthorHaiku.Id = authorHaikuId;
            updatedAuthorHaiku.Title = string.IsNullOrWhiteSpace(updatedAuthorHaiku.Title) ? DefaultTitle : updatedAuthorHaiku.Title;

            var rowsAffected = await _authorHaikuRepository.UpdateAuthorHaikuAsync(updatedAuthorHaiku);

            if (rowsAffected <= 0)
                throw new NotSavedException($"{updatedAuthorHaiku.Title}, was not updated succesfully");
        }

        /// <summary>
        /// Deletes an <see cref="AuthorHaiku"/> from the repository by its ID.
        /// </summary>
        /// <param name="authorHaikuId">The ID of the <see cref="AuthorHaiku"/> to delete.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="AuthorHaiku"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="AuthorHaiku"/> could not be deleted.</exception>
        public async Task DeleteAuthorHaikuByIdAsync(long authorHaikuId)
        {
            if (!await AuthorHaikuExistsByIdAsync(authorHaikuId))
                throw new NotFoundException($"Author Haiku with ID: {authorHaikuId}, was not found.");

            var authorRowsAffected = await _authorHaikuRepository.DeleteAuthorHaikuByIdAsync(authorHaikuId);

            if (authorRowsAffected <= 0)
                throw new NotSavedException($"Author Haiku with ID: {authorHaikuId}, was not deleted succesfully");
        }

        /// <summary>
        /// Checks if an <see cref="AuthorHaiku"/> exists in the repository by its ID.
        /// </summary>
        /// <param name="authorHaikuId">The ID of the <see cref="AuthorHaiku"/> to check.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="AuthorHaiku"/> exists.</returns>
        public async Task<bool> AuthorHaikuExistsByIdAsync(long authorHaikuId)
        {
            if (!await _authorHaikuRepository.AuthorHaikuExistsByIdAsync(authorHaikuId))
                return false;

            return true;
        }
    }
}
