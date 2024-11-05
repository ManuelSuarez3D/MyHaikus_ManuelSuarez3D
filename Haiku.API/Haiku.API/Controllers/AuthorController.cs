using Haiku.API.Dtos;
using Haiku.API.Services.AuthorServices;
using Haiku.API.Services.PaginationServices;
using Haiku.API.Services.XmlSerializationServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Haiku.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorService _authorService;
        private readonly IPaginationService _paginationService;
        private readonly IXmlSerializationService _xmlSerialization;
        private readonly ILogger<AuthorController> _logger;

        public AuthorController(IAuthorService authorService, IPaginationService paginationService, IXmlSerializationService xmlSerialization, ILogger<AuthorController> logger)
        {
            _authorService = authorService;
            _paginationService = paginationService;
            _xmlSerialization = xmlSerialization;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="Author"/>'s.
        /// </summary>
        /// <param name="currentPage">The current page number (default is <see langword="1"/>).</param>
        /// <param name="pageSize">The number of <see cref="Author"/>'s per page (default is <see langword="10"/>).</param>
        /// <param name="searchOption">An optional search term for filtering <see cref="Author"/>'s. If <see langword="null"/>, no filtering is applied.</param>
        /// <returns>A <see cref="IActionResult"/> containing a list of <see cref="Author"/>'s along with pagination metadata.</returns>
        [HttpGet]
        [Produces("application/xml")]
        public async Task<IActionResult> GetAllPaginatedAuthorsAsync(int currentPage = 1, int pageSize = 10, string? searchOption = null)
        {
            var authorDtos = await _authorService.GetPaginatedAuthorsAsync(currentPage, pageSize, searchOption ?? string.Empty);
            var totalAuthors = await _authorService.GetTotalAuthorsAsync(searchOption ?? string.Empty);
            var paginationMetaDataDto = _paginationService.GetPaginationMetaData(totalAuthors, pageSize, currentPage);

            var sanitizedXml = _xmlSerialization.SerializeAndSanitizeToXml(paginationMetaDataDto);
            Response.Headers["x-pagination"] = sanitizedXml;

            return Ok(authorDtos);
        }

        /// <summary>
        /// Retrieves a specific <see cref="Author"/> by their unique identifier.
        /// </summary>
        /// <param name="authorId">The unique identifier of the <see cref="Author"/> to retrieve.</param>
        /// <returns>
        /// An <see cref="ActionResult{AuthorDto}"/> containing the <see cref="Author"/> details if found,
        /// or a 404 Not Found status if the <see cref="Author"/> does not exist.
        /// </returns>
        [HttpGet("{authorId}", Name = "AuthorDetails")]
        [Produces("application/xml")]
        public async Task<ActionResult<AuthorDto>> GetAuthorByIdAsync(long authorId)
        {
            var authorDto = await _authorService.GetAuthorByIdAsync(authorId);
            return Ok(authorDto);
        }

        /// <summary>
        /// Creates a new <see cref="Author"/> using the provided <see cref="AuthorDto"/> details.
        /// </summary>
        /// <param name="authorDto">The details of the <see cref="Author"/> to create.</param>
        /// <returns>
        /// An <see cref="ActionResult{AuthorDto}"/> representing the created <see cref="Author"/> details,
        /// or a 400 Bad Request if the input validation fails.
        /// </returns>
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        [Authorize(Policy = "AdminRole")]
        public async Task<ActionResult<AuthorDto>> PostAuthorAsync(AuthorDto authorDto)
        {
            if (!ModelState.IsValid) 
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
            }

            var newAuthorDto = await _authorService.AddAuthorAsync(authorDto);

            return CreatedAtRoute("AuthorDetails", new { authorId = newAuthorDto.Id }, newAuthorDto);
        }

        /// <summary>
        /// Updates the details of an existing <see cref="Author"/> specified by their ID.
        /// </summary>
        /// <param name="authorId">The ID of the <see cref="Author"/> to update.</param>
        /// <param name="authorDto">The updated details of the <see cref="Author"/>.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the update operation.
        /// Returns 204 No Content on a successful update,
        /// or 400 Bad Request if the input validation fails,
        /// or 404 Not Found if the <see cref="Author"/> does not exist.
        /// </returns>
        [HttpPut("{authorId}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        [Authorize(Policy = "AdminRole")]
        public async Task<IActionResult> PutAuthorAsync(long authorId, [FromBody] AuthorDto authorDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState);
            }
            
            await _authorService.UpdateAuthorAsync(authorId, authorDto);
            
            return NoContent();
        }

        /// <summary>
        /// Deletes an <see cref="Author"/> specified by their ID.
        /// </summary>
        /// <param name="authorId">The ID of the <see cref="Author"/> to delete.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the delete operation.
        /// Returns 204 No Content on a successful deletion,
        /// or 404 Not Found if the <see cref="Author"/> does not exist.
        /// </returns>
        [HttpDelete("{authorId}")]
        [Produces("application/xml")]
        [Authorize(Policy = "AdminRole")]
        public async Task<IActionResult> DeleteAuthorAsync(long authorId)
        {
            await _authorService.DeleteAuthorByIdAsync(authorId);

            return NoContent();
        }
    }
}
