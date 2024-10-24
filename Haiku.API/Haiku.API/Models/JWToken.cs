using System.ComponentModel.DataAnnotations;

namespace Haiku.API.Models
{
    public class JWToken
    {
        public long Id { get; set; }

        [Required]
        public required string Token { get; set; }

        [Required]
        public required string ExpiresIn { get; set; }

        [Required]
        public long UserId { get; set; }
    }
}
