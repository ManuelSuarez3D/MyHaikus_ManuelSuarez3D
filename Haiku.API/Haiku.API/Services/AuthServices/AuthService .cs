using AutoMapper;
using Haiku.API.Dtos;
using Haiku.API.Exceptions;
using Haiku.API.Models;
using Haiku.API.Services.RoleServices;
using Haiku.API.Services.UserServices;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Haiku.API.Services.AuthServices
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IRoleService _roleService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly JwtSettings _jwtSettings;

        public AuthService(IUserService userService, IRoleService roleService, IConfiguration configuration, IMapper mapper, IOptions<JwtSettings> jwtSettings)
        {
            _userService = userService;
            _roleService = roleService;
            _configuration = configuration;
            _mapper = mapper;
            _jwtSettings = jwtSettings.Value;
        }

        /// <summary>
        /// Authenticates a <see cref="User"/> using the provided credentials and generates a JSON Web Token (JWT).
        /// </summary>
        /// <param name="loginDto">The login credentials provided by the <see cref="User"/> in the form of a <see cref="LoginDto"/>.</param>
        /// <returns>
        /// A task representing the asynchronous operation, returning a <see cref="JWTokenDto"/> containing the JWT token if authentication is successful.
        /// </returns>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="User"/> or <see cref="Role"/> cannot be retrieved based on the provided login credentials.
        /// </exception>
        public async Task<JWTokenDto> AuthenticateUserAsync(LoginDto loginDto)
        {
            var userLogin = _mapper.Map<User>(loginDto);
            var user = await _userService.AuthenticateUserAsync(userLogin.Username, userLogin.Password);
            var role = await _roleService.GetRoleByUserIdAsync(user.Id);

            if (user == null || role == null)
                throw new NotRetrievedException($"Login information was not retrieved successfully.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, role.Title)
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new JWTokenDto { Token = tokenString };
        }
    }
}
