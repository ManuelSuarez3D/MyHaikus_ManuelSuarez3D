using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace Haiku.API.Dtos
{
    [XmlRoot("LoginDto")]
    public class LoginDto
    {
        [XmlElement("id")]
        public long Id { get; set; }

        [XmlElement("username")]
        [Required]
        [StringLength(20, ErrorMessage = "Username length can't be more than 20 characters.")]
        [MinLength(4, ErrorMessage = "Username length must be at least 4 characters.")]
        public required string Username { get; set; }

        [XmlElement("password")]
        [Required]
        [StringLength(30, ErrorMessage = "Password length can't be more than 30 characters.")]
        [MinLength(4, ErrorMessage = "Password length must be at least 8 characters.")]
        public required string Password { get; set; }
    }
}
