using Haiku.API.Utilities;
using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace Haiku.API.Dtos
{
    [XmlRoot("UserHaikuDto")]
    public class UserHaikuDto
    {
        [XmlElement("id")]
        public long Id { get; set; }

        [XmlElement("title")]
        [StringLength(50, ErrorMessage = "Title length can't be more than 50 characters.")]
        [MinLength(2, ErrorMessage = "Title length must be at least 2 characters.")]
        public required string? Title { get; set; } = "Untitled";

        [XmlElement("lineOne")]
        [SyllableCount(5, ErrorMessage = "Must be five syllables")]
        [Required]
        [StringLength(50, ErrorMessage = "First line length can't be more than 50.")]
        public required string LineOne { get; set; }

        [XmlElement("lineTwo")]
        [SyllableCount(7, ErrorMessage = "Must be seven syllables")]
        [Required]
        [StringLength(50, ErrorMessage = "Second line length can't be more than 50.")]
        public required string LineTwo { get; set; }

        [XmlElement("lineThree")]
        [SyllableCount(5, ErrorMessage = "Must be five syllables")]
        [Required]
        [StringLength(50, ErrorMessage = "Third line length can't be more than 50.")]
        public required string LineThree { get; set; }

        [XmlElement("userId")]
        [Required]
        public long UserId { get; set; }
    }
}
