using System.Xml.Serialization;

namespace Haiku.API.Models
{
    public class ErrorDetails
    {
        public int StatusCode { get; set; }
        public required string Message { get; set; }

        public string ToXml()
        {
            var xmlSerializer = new XmlSerializer(typeof(ErrorDetails));
            using (var stringWriter = new StringWriter())
            {
                xmlSerializer.Serialize(stringWriter, this);
                return stringWriter.ToString();
            }
        }
    }
}
