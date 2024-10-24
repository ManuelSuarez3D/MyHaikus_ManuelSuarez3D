using Haiku.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Haiku.API.Services.IProfileServices;
using Microsoft.AspNetCore.Authorization;

namespace Haiku.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(IProfileService profileService, ILogger<ProfileController> logger)
        {
            _profileService = profileService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves user <see cref="Profile"/>'s for the specified user IDs.
        /// </summary>
        /// <param name="userIds">A list of user IDs for which to fetch <see cref="Profile"/>'s.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> containing the list of user <see cref="Profile"/>'s,
        /// or a 500 Internal Server Error if an unexpected error occurs.
        /// </returns>
        [HttpGet("profiles-by-ids")]
        [Produces("application/xml")]
        public async Task<IActionResult> GetAllProfilesByUserIdsAsync([FromQuery] List<long> userIds)
        {
            _logger.LogError("{userIds}, logged from Controller.",userIds);
            var profileDtos = await _profileService.GetAllProfilesByUserIdsAsync(userIds);

            return Ok(profileDtos);
        }

        /// <summary>
        /// Retrieves a specific user <see cref="Profile"/> by their unique identifier.
        /// </summary>
        /// <param name="profileId">The unique identifier of the user <see cref="Profile"/> to retrieve.</param>
        /// <returns>
        /// An <see cref="ActionResult{ProfileDto}"/> containing the user <see cref="Profile"/> details if found,
        /// or a 404 Not Found status if the user <see cref="Profile"/> does not exist.
        /// </returns>
        [HttpGet("{profileId}", Name = "ProfileDetails")]
        [Produces("application/xml")]
        public async Task<ActionResult<ProfileDto>> GetProfileByIdAsync(long profileId)
        {
            var profileDto = await _profileService.GetProfileByIdAsync(profileId);
            return Ok(profileDto);
        }

        /// <summary>
        /// Retrieves a specific user <see cref="Profile"/>by their user's unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the user <see cref="Profile"/>user to retrieve.</param>
        /// <returns>
        /// An <see cref="ActionResult{AuthorHaikuDto}"/> containing the user <see cref="Profile"/> details if found,
        /// or a 404 Not Found status if the user <see cref="Profile"/> does not exist.
        /// </returns>
        [HttpGet("user/{userId}")]
        [Produces("application/xml")]
        public async Task<ActionResult<ProfileDto>> GetProfileByUserIdAsync(long userId)
        {
            var profileDto = await _profileService.GetProfileByUserIdAsync(userId);
            return Ok(profileDto);
        }

        /// <summary>
        /// Creates a new user <see cref="Profile"/> using the provided user <see cref="Profile"/> details.
        /// </summary>
        /// <param name="profileDto">The details of the user <see cref="Profile"/> to create.</param>
        /// <returns>
        /// An <see cref="ActionResult{ProfileDto}"/> representing the created user <see cref="Profile"/>  details,
        /// or a 400 Bad Request if the input validation fails.
        /// </returns>
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        [Authorize]
        public async Task<ActionResult<ProfileDto>> PostProfileAsync(ProfileDto profileDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
            }

            var newProfileDto = await _profileService.AddProfileAsync(profileDto);

            return CreatedAtRoute("ProfileDetails", new { profileId = newProfileDto.Id }, newProfileDto);
        }

        /// <summary>
        /// Updates the details of an existing user <see cref="Profile"/> specified by their ID.
        /// </summary>
        /// <param name="profileId">The ID of the user <see cref="Profile"/> to update.</param>
        /// <param name="profileDto">The updated details of the user <see cref="Profile"/>.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the update operation.
        /// Returns 204 No Content on a successful update,
        /// or 400 Bad Request if the input validation fails,
        /// or 404 Not Found if the user <see cref="Profile"/> does not exist.
        /// </returns>
        [HttpPut("{profileId}")]
        [Consumes("application/xml")]
        [Authorize]
        public async Task<IActionResult> PutProfileAsync(long profileId, [FromBody] ProfileDto profileDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {@ModelStateErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState);
            }

            await _profileService.UpdateProfileAsync(profileId, profileDto);

            return NoContent();
        }
    }
}
