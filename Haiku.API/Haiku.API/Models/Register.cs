using System.ComponentModel.DataAnnotations;

namespace Haiku.API.Models
{
    public class Register
    {
        public long Id { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "Username length can't be more than 20 characters.")]
        [MinLength(4, ErrorMessage = "Username length must be at least 4 characters.")]
        public required string Username { get; set; }

        [Required]
        [StringLength(30, ErrorMessage = "Password length can't be more than 30 characters.")]
        [MinLength(8, ErrorMessage = "Password length must be at least 8 characters.")]
        public required string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public required string ConfirmPassword { get; set; }
    }
}
