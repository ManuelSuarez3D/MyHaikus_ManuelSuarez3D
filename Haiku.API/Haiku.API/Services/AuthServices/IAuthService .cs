using Haiku.API.Dtos;

namespace Haiku.API.Services.AuthServices
{
    public interface IAuthService
    {
        Task<JWTokenDto> AuthenticateUserAsync(LoginDto loginDto);
    }
}
