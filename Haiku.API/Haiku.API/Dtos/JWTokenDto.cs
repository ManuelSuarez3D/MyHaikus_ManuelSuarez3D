using System.Xml.Serialization;

namespace Haiku.API.Dtos
{
    [XmlRoot("JWTokenDto")]
    public class JWTokenDto
    {
        [XmlElement("token")]
        public required string Token { get; set; }
    }
}
