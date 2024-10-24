using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace Haiku.API.Dtos
{
    [XmlRoot("ImageDto")]
    public class ImageDto
    {
        [XmlElement("id")]
        public long Id { get; set; }

        [XmlElement("filePath")]
        [Required]
        public required string FilePath { get; set; }
    }
}
