using Haiku.API.Dtos;
using Haiku.API.Services.AuthorHaikuServices;
using Haiku.API.Services.PaginationService;
using Microsoft.AspNetCore.Mvc;
using Haiku.API.Services.XmlSerializationServices;
using Microsoft.AspNetCore.Authorization;

namespace Haiku.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorHaikuController : ControllerBase
    {
        private readonly IAuthorHaikuService _authorHaikuService;
        private readonly IPaginationUtility _paginationService;
        private readonly IXmlSerialization _xmlSerializationService;
        private readonly ILogger<AuthorHaikuController> _logger;

        public AuthorHaikuController(IAuthorHaikuService authorHaikuService, IPaginationUtility paginationService, IXmlSerialization xmlSerializationService, ILogger<AuthorHaikuController> logger)
        {
            _authorHaikuService = authorHaikuService;
            _paginationService = paginationService;
            _xmlSerializationService = xmlSerializationService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="AuthorHaiku"/>'s.
        /// </summary>
        /// <param name="currentPage">The current page number (default is <see langword="1"/>).</param>
        /// <param name="pageSize">The number of <see cref="AuthorHaiku"/>'s per page (default is <see langword="10"/>).</param>
        /// <param name="searchOption">An optional search term for filtering <see cref="AuthorHaiku"/>'s. If <see langword="null"/>, no filtering is applied.</param>
        /// <returns>A <see cref="IActionResult"/> containing a list of <see cref="AuthorHaiku"/>'s along with pagination metadata.</returns>
        [HttpGet]
        [Produces("application/xml")]
        public async Task<IActionResult> GetAllPaginatedAuthorHaikusAsync(int currentPage = 1, int pageSize = 10, string? searchOption = null)
        {
            var authorHaikuDtos = await _authorHaikuService.GetPaginatedAuthorHaikusAsync(currentPage, pageSize, searchOption ?? string.Empty);
            var totalAuthorHaikus = await _authorHaikuService.GetTotalAuthorHaikusAsync(searchOption ?? string.Empty);
            var paginationMetaDataDto = _paginationService.GetPaginationMetaData(totalAuthorHaikus, pageSize, currentPage);

            var sanitizedXml = _xmlSerializationService.SerializeAndSanitizeToXml(paginationMetaDataDto);
            Response.Headers["x-pagination"] = sanitizedXml;

            return Ok(authorHaikuDtos);
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="AuthorHaiku"/>'s from an <see cref="Author"/>.
        /// </summary>
        /// <param name="authorId">The <see cref="Author"/> identifier to retrieve with.</param>
        /// <param name="currentPage">The current page number (default is <see langword="1"/>).</param>
        /// <param name="pageSize">The number of <see cref="AuthorHaiku"/>'s per page (default is <see langword="10"/>).</param>
        /// <param name="searchOption">An optional search term for filtering <see cref="AuthorHaiku"/>'s. If <see langword="null"/>, no filtering is applied.</param>
        /// <returns>A <see cref="IActionResult"/> containing a list of <see cref="AuthorHaiku"/>'s along with pagination metadata.</returns>
        [HttpGet("Author/{authorId}")]
        [Produces("application/xml")]
        public async Task<IActionResult> GetPaginatedAuthorHaikusByAuthorIdAsync(long authorId, int currentPage = 1, int pageSize = 10, string? searchOption = null)
        {
            var authorHaikusDtos = await _authorHaikuService.GetPaginatedAuthorHaikusByAuthorIdAsync(authorId, currentPage, pageSize, searchOption ?? string.Empty);
            var totalAuthorHaikus = await _authorHaikuService.GetTotalAuthorHaikusByAuthorIdAsync(authorId, searchOption ?? string.Empty);
            var paginationMetaDataDto = _paginationService.GetPaginationMetaData(totalAuthorHaikus, pageSize, currentPage);

            var sanitizedXml = _xmlSerializationService.SerializeAndSanitizeToXml(paginationMetaDataDto);
            Response.Headers["x-pagination"] = sanitizedXml;

            return Ok(authorHaikusDtos);
        }

        /// <summary>
        /// Retrieves a specific <see cref="AuthorHaiku"/> by their unique identifier.
        /// </summary>
        /// <param name="authorHaikuId">The unique identifier of the <see cref="AuthorHaiku"/> to retrieve.</param>
        /// <returns>
        /// An <see cref="ActionResult{AuthorHaikuDto}"/> containing the <see cref="AuthorHaiku"/> details if found,
        /// or a 404 Not Found status if the <see cref="AuthorHaiku"/> does not exist.
        /// </returns>
        [HttpGet("{authorHaikuId}", Name = "AuthorHaikuDetails")]
        [Produces("application/xml")]
        public async Task<ActionResult<AuthorHaikuDto>> GetAuthorHaikuByIdAsync(long authorHaikuId)
        {
            var authorHaikuDto = await _authorHaikuService.GetAuthorHaikuByIdAsync(authorHaikuId);
            return Ok(authorHaikuDto);
        }

        /// <summary>
        /// Creates a new <see cref="AuthorHaiku"/> using the provided <see cref="AuthorHaiku"/> details.
        /// </summary>
        /// <param name="authorHaikuDto">The details of the <see cref="AuthorHaiku"/> to create.</param>
        /// <returns>
        /// An <see cref="ActionResult{AuthorHaikuDto}"/> representing the created <see cref="AuthorHaiku"/> details,
        /// or a 400 Bad Request if the input validation fails.
        /// </returns>
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        [Authorize(Policy = "AdminRole")]
        public async Task<ActionResult<AuthorHaikuDto>> PostAuthorHaikuAsync(AuthorHaikuDto authorHaikuDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
            }

            var newAuthorHaikuDto = await _authorHaikuService.AddAuthorHaikuAsync(authorHaikuDto);

            return CreatedAtRoute("AuthorHaikuDetails", new { authorHaikuId = newAuthorHaikuDto.Id }, newAuthorHaikuDto);
        }

        /// <summary>
        /// Updates the details of an existing <see cref="AuthorHaiku"/> specified by their ID.
        /// </summary>
        /// <param name="authorHaikuId">The ID of the <see cref="AuthorHaiku"/> to update.</param>
        /// <param name="authorHaikuDto">The updated details of the <see cref="AuthorHaiku"/>.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the update operation.
        /// Returns 204 No Content on a successful update,
        /// or 400 Bad Request if the input validation fails,
        /// or 404 Not Found if the <see cref="AuthorHaiku"/> does not exist.
        /// </returns>
        [HttpPut("{authorHaikuId}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        [Authorize(Policy = "AdminRole")]
        public async Task<IActionResult> PutAuthorHaikuAsync(long authorHaikuId, [FromBody] AuthorHaikuDto authorHaikuDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState);
            }

            await _authorHaikuService.UpdateAuthorHaikuAsync(authorHaikuId, authorHaikuDto);

            return NoContent();
        }

        /// <summary>
        /// Deletes an <see cref="AuthorHaiku"/> specified by their ID.
        /// </summary>
        /// <param name="authorHaikuId">The ID of the <see cref="AuthorHaiku"/> to delete.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the delete operation.
        /// Returns 204 No Content on a successful deletion,
        /// or 404 Not Found if the <see cref="AuthorHaiku"/> does not exist.
        /// </returns>
        [HttpDelete("{authorHaikuId}")]
        [Produces("application/xml")]
        [Authorize(Policy = "AdminRole")]
        public async Task<IActionResult> DeleteAuthorHaikuAsync(long authorHaikuId)
        {
            await _authorHaikuService.DeleteAuthorHaikuByIdAsync(authorHaikuId);

            return NoContent();
        }
    }
}
