using Haiku.API.Dtos;
using Haiku.API.Services.UserHaikuServices;
using Haiku.API.Services.PaginationService;
using Microsoft.AspNetCore.Mvc;
using Haiku.API.Services.XmlSerializationServices;
using Microsoft.AspNetCore.Authorization;

namespace Haiku.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserHaikuController : ControllerBase
    {
        private readonly IUserHaikuService _userHaikuService;
        private readonly IPaginationUtility _paginationService;
        private readonly IXmlSerialization _xmlSerializationService;
        private readonly ILogger<UserHaikuController> _logger;

        public UserHaikuController(IUserHaikuService userHaikuService, IPaginationUtility paginationService, IXmlSerialization xmlSerializationService, ILogger<UserHaikuController> logger)
        {
            _userHaikuService = userHaikuService;
            _paginationService = paginationService;
            _xmlSerializationService = xmlSerializationService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="UserHaiku"/>'s.
        /// </summary>
        /// <param name="currentPage">The current page number (default is <see langword="1"/>).</param>
        /// <param name="pageSize">The number of <see cref="UserHaiku"/>'s per page (default is <see langword="10"/>).</param>
        /// <param name="searchOption">An optional search term for filtering <see cref="UserHaiku"/>'s. If <see langword="null"/>, no filtering is applied.</param>
        /// <returns>A <see cref="IActionResult"/> containing a list of <see cref="UserHaiku"/>'s along with pagination metadata.</returns>
        [HttpGet]
        [Produces("application/xml")]
        public async Task<IActionResult> GetAllPaginatedHaikusAsync(int currentPage = 1, int pageSize = 10, string? searchOption = null)
        {
            var haikuDtos = await _userHaikuService.GetPaginatedUserHaikusAsync(currentPage, pageSize, searchOption ?? string.Empty);
            var totalHaikus = await _userHaikuService.GetTotalUserHaikusAsync(searchOption ?? string.Empty);
            var paginationMetaDataDto = _paginationService.GetPaginationMetaData(totalHaikus, pageSize, currentPage);

            var sanitizedXml = _xmlSerializationService.SerializeAndSanitizeToXml(paginationMetaDataDto);
            Response.Headers["x-pagination"] = sanitizedXml;

            return Ok(haikuDtos);
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="UserHaiku"/>'s from an user.
        /// </summary>
        /// <param name="userId">The user identifier to retrieve with.</param>
        /// <param name="currentPage">The current page number (default is <see langword="1"/>).</param>
        /// <param name="pageSize">The number of <see cref="UserHaiku"/>'s per page (default is <see langword="10"/>).</param>
        /// <param name="searchOption">An optional search term for filtering <see cref="UserHaiku"/>'s. If <see langword="null"/>, no filtering is applied.</param>
        /// <returns>A <see cref="IActionResult"/> containing a list of <see cref="UserHaiku"/>'s along with pagination metadata.</returns>
        [HttpGet("User/{userId}")]
        [Produces("application/xml")]
        public async Task<IActionResult> GetPaginatedUserHaikusByUserIdAsync(long userId, int currentPage = 1, int pageSize = 10, string? searchOption = null)
        {
            var userHaikusDtos = await _userHaikuService.GetPaginatedUserHaikusByUserIdAsync(userId, currentPage, pageSize, searchOption ?? string.Empty);
            var totalUserHaikus = await _userHaikuService.GetTotalUserHaikusByUserIdAsync(userId, searchOption ?? string.Empty);
            var paginationMetaDataDto = _paginationService.GetPaginationMetaData(totalUserHaikus, pageSize, currentPage);

            var sanitizedXml = _xmlSerializationService.SerializeAndSanitizeToXml(paginationMetaDataDto);
            Response.Headers["x-pagination"] = sanitizedXml;

            return Ok(userHaikusDtos);
        }

        /// <summary>
        /// Retrieves a specific <see cref="UserHaiku"/> by their unique identifier.
        /// </summary>
        /// <param name="userHaikuId">The unique identifier of the <see cref="UserHaiku"/> to retrieve.</param>
        /// <returns>
        /// An <see cref="ActionResult{UserHaikuDto}"/> containing the <see cref="UserHaiku"/> details if found,
        /// or a 404 Not Found status if the <see cref="UserHaiku"/> does not exist.
        /// </returns>
        [HttpGet("{userHaikuId}", Name = "UserHaikuDetails")]
        [Produces("application/xml")]
        public async Task<ActionResult<UserHaikuDto>> GetUserHaikuByIdAsync(long userHaikuId)
        {
            var haikuDto = await _userHaikuService.GetUserHaikuByIdAsync(userHaikuId);
            return Ok(haikuDto);
        }

        /// <summary>
        /// Creates a new <see cref="UserHaiku"/> using the provided <see cref="UserHaiku"/> details.
        /// </summary>
        /// <param name="userHaikuDto">The details of the <see cref="UserHaiku"/> to create.</param>
        /// <returns>
        /// An <see cref="ActionResult{UserHaikuDto}"/> representing the created <see cref="UserHaiku"/> details,
        /// or a 400 Bad Request if the input validation fails.
        /// </returns>
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        [Authorize]
        public async Task<ActionResult<UserHaikuDto>> PostUserHaikuAsync(UserHaikuDto userHaikuDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
            }

            var newHaikuDto = await _userHaikuService.AddUserHaikuAsync(userHaikuDto);

            return CreatedAtRoute("UserHaikuDetails", new { userHaikuId = newHaikuDto.Id }, newHaikuDto);
        }

        /// <summary>
        /// Updates the details of an existing <see cref="UserHaiku"/> specified by their ID.
        /// </summary>
        /// <param name="userHaikuId">The ID of the <see cref="UserHaiku"/> to update.</param>
        /// <param name="userHaikuDto">The updated details of the <see cref="UserHaiku"/>.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the update operation.
        /// Returns 204 No Content on a successful update,
        /// or 400 Bad Request if the input validation fails,
        /// or 404 Not Found if the <see cref="UserHaiku"/> does not exist.
        /// </returns>
        [HttpPut("{userHaikuId}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        [Authorize]
        public async Task<IActionResult> PutUserHaikuAsync(long userHaikuId, [FromBody] UserHaikuDto userHaikuDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState);
            }

            await _userHaikuService.UpdateUserHaikuAsync(userHaikuId, userHaikuDto);

            return NoContent();
        }

        /// <summary>
        /// Deletes an <see cref="UserHaiku"/> specified by their ID.
        /// </summary>
        /// <param name="userHaikuId">The ID of the <see cref="UserHaiku"/> to delete.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the delete operation.
        /// Returns 204 No Content on a successful deletion,
        /// or 404 Not Found if the <see cref="UserHaiku"/> does not exist.
        /// </returns>
        [HttpDelete("{userHaikuId}")]
        [Produces("application/xml")]
        [Authorize]
        public async Task<IActionResult> DeleteUserHaikuAsync(long userHaikuId)
        {
             await _userHaikuService.DeleteUserHaikuByIdAsync(userHaikuId);

             return NoContent();
        }
    }
}