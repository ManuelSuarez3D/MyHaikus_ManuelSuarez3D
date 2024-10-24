using Haiku.API.Dtos;
using Haiku.API.Services.UserServices;
using Microsoft.AspNetCore.Mvc;

namespace Haiku.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<RegisterController> _logger;

        public RegisterController(IUserService userService, ILogger<RegisterController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Registers a new <see cref="User"/> in the system.
        /// </summary>
        /// <param name="registerUserDto">The details of the <see cref="User"/> to register.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> containing the newly registered <see cref="User"/> details,
        /// or a 400 Bad Request if the input validation fails.
        /// </returns>
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<IActionResult> PostRegisterUser([FromBody] RegisterDto registerUserDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {LoginErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
            }

            var newRegisteredUserDto = await _userService.AddUserAsync(registerUserDto);

            return Ok(newRegisteredUserDto);
        }
    }
}
