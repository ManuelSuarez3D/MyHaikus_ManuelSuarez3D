using System.ComponentModel.DataAnnotations;
using System.Xml.Serialization;

namespace Haiku.API.Dtos
{
    [XmlRoot("ProfileDto")]
    public class ProfileDto
    {
        [XmlElement("id")]
        public long Id { get; set; }

        [XmlElement("bio")]
        public string? Bio { get; set; }

        [XmlElement("imageId")]
        public long ImageId { get; set; }

        [XmlElement("userId")]
        public required long UserId { get; set; }
    }
}
