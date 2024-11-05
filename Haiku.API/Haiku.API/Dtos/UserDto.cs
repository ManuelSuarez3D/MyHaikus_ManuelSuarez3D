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
        [StringLengthIfNotEmptyAttributeUtility(20, "Username")]
        [MinLengthIfNotEmptyAttributeUtility(4, "Username")]
        public required string Username { get; set; }

        [XmlElement("password")]
        [StringLengthIfNotEmptyAttributeUtility(20, "Password")]
        [MinLengthIfNotEmptyAttributeUtility(8, "Password")]
        public required string Password { get; set; }

        [XmlElement("roleId")]
        [Required]
        public long RoleId { get; set; }
    }
}
