using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace Haiku.API.Dtos
{
    [XmlRoot("AuthorDto")]
    public class AuthorDto
    {
        [XmlElement("id")]
        public long Id { get; set; }

        [XmlElement("name")]
        [Required]
        [StringLength(50, ErrorMessage = "Name length can't be more than 50 characters.")]
        [MinLength(2, ErrorMessage = "Name length must be at least 2 characters.")]
        public required string Name { get; set; }

        [XmlElement("bio")]
        [StringLength(300, ErrorMessage = "Bio length can't be more than 300 characters.")]
        [MinLength(4, ErrorMessage = "Name length must be at least 4 characters.")]
        public string? Bio { get; set; }
    }
}
