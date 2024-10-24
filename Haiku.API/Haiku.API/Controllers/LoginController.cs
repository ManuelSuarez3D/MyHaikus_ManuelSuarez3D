using Haiku.API.Dtos;
using Haiku.API.Services.AuthServices;
using Microsoft.AspNetCore.Mvc;

namespace Haiku.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<LoginController> _logger;

        public LoginController(IAuthService authService, ILogger<LoginController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Authenticates a <see cref="User"/> based on the provided login credentials.
        /// </summary>
        /// <param name="loginDto">The login details including username and password.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> containing the authentication token on successful login,
        /// or a 400 Bad Request if the input validation fails,
        /// or a 401 Unauthorized if authentication fails.
        /// </returns>
        [HttpPost]
        [Consumes("application/xml")]
        [Produces("application/xml")]
        public async Task<IActionResult> PostLoginUser([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Input validation failed: {LoginErrors}, logged from Controller.", ModelState.Values.SelectMany(v => v.Errors));
                return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
            }

            var tokenDto = await _authService.AuthenticateUserAsync(loginDto);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(1)
            };

            Response.Cookies.Append("jwtToken", tokenDto.Token, cookieOptions);
            return Ok(tokenDto);
        }
    }
}
