using Haiku.API.Dtos;
using Haiku.API.Services.PaginationService;
using Haiku.API.Services.XmlSerializationServices;
using Microsoft.AspNetCore.Mvc;
using Haiku.API.Services.UserServices;
using Microsoft.AspNetCore.Authorization;

namespace Haiku.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPaginationUtility _paginationService;
        private readonly IXmlSerialization _xmlSerializationService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, IPaginationUtility paginationService, IXmlSerialization xmlSerializationService, ILogger<UserController> logger)
        {
            _userService = userService;
            _paginationService = paginationService;
            _xmlSerializationService = xmlSerializationService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a paginated list of <see cref="User"/>'s.
        /// </summary>
        /// <param name="currentPage">The current page number (default is <see langword="1"/>).</param>
        /// <param name="pageSize">The number of <see cref="User"/>'s per page (default is <see langword="10"/>).</param>
        /// <param name="searchOption">An optional search term for filtering <see cref="User"/>'s. If <see langword="null"/>, no filtering is applied.</param>
        /// <returns>A <see cref="IActionResult"/> containing a list of <see cref="User"/>'s along with pagination metadata.</returns>
        [HttpGet]
        [Produces("application/xml")]
        public async Task<IActionResult> GetAllPaginatedUsersAsync(int currentPage = 1, int pageSize = 10, string? searchOption = null) 
        {
            var userDtos = await _userService.GetPaginatedUsersAsync(currentPage, pageSize, searchOption ?? string.Empty);
            var totalUsers = await _userService.GetTotalUsersAsync(searchOption ?? string.Empty);
            var paginationMetaDataDto = _paginationService.GetPaginationMetaData(totalUsers, pageSize, currentPage);

            var sanitizedXml = _xmlSerializationService.SerializeAndSanitizeToXml(paginationMetaDataDto);
            Response.Headers["x-pagination"] = sanitizedXml;

            return Ok(userDtos);
        }

        /// <summary>
        /// Verifies if a given username already exists in the system.
        /// </summary>
        /// <param name="username">The username to verify for existence.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> containing a boolean indicating whether the username exists.
        /// </returns>
        [HttpGet("verify-username/{username}")]
        [Produces("application/xml")]
        public async Task<IActionResult> UsernameVerificationAsync(string username)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState);
            }

            var verificationResult = await _userService.UsernameVerificationAsync(username);

            return Ok(verificationResult);
        }

        /// <summary>
        /// Retrieves a specific <see cref="User"/> by their unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="User"/> to retrieve.</param>
        /// <returns>
        /// An <see cref="ActionResult{UserDto}"/> containing the <see cref="User"/> details if found,
        /// or a 404 Not Found status if the <see cref="User"/> does not exist.
        /// </returns>
        [HttpGet("{userId}", Name = "UserDetails")]
        [Produces("application/xml")]
        public async Task<ActionResult<UserDto>> GetUserByIdAsync(long userId)
        {
            var userDto = await _userService.GetUserByIdAsync(userId);
            return Ok(userDto);
        }

        /// <summary>
        /// Updates the details of an existing <see cref="User"/> specified by their ID.
        /// </summary>
        /// <param name="userId">The ID of the <see cref="User"/> to update.</param>
        /// <param name="userDto">The updated details of the <see cref="User"/>.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the update operation.
        /// Returns 204 No Content on a successful update,
        /// or 400 Bad Request if the input validation fails,
        /// or 404 Not Found if the user does not exist.
        /// </returns>
        [HttpPut("{userId}")]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        [Authorize]
        public async Task<IActionResult> PutUserAsync(long userId, [FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState);
            }

            await _userService.UpdateUserAsync(userId, userDto);

            return NoContent();
        }

        /// <summary>
        /// Deletes an <see cref="User"/> specified by their ID.
        /// </summary>
        /// <param name="userId">The ID of the <see cref="User"/> to delete.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the delete operation.
        /// Returns 204 No Content on a successful deletion,
        /// or 404 Not Found if the <see cref="User"/> does not exist.
        /// </returns>
        [HttpDelete("{userId}")]
        [Produces("application/xml")]
        [Authorize]
        public async Task<IActionResult> DeleteUserByIdAsync(long userId)
        {
            await _userService.DeleteUserByIdAsync(userId);

            return NoContent();
        }
    }
}
