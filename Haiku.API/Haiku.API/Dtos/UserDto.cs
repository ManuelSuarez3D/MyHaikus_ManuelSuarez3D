using Haiku.API.Utilities;
using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace Haiku.API.Dtos
{
    [XmlRoot("UserDto")]
    public class UserDto
    {
        [XmlElement("id")]
        public long Id { get; set; }

        [XmlElement("username")]
        [StringLengthIfNotEmpty(20, "Username")]
        [MinLengthIfNotEmpty(4, "Username")]
        public required string Username { get; set; }

        [XmlElement("password")]
        [StringLengthIfNotEmpty(20, "Password")]
        [MinLengthIfNotEmpty(8, "Password")]
        public required string Password { get; set; }

        [XmlElement("roleId")]
        [Required]
        public long RoleId { get; set; }
    }
}
