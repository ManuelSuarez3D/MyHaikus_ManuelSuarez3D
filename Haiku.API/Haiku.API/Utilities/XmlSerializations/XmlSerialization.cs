using Haiku.API.Dtos;
using Haiku.API.Utilities.XmlSerializations;
using System.Xml.Serialization;

public class XmlSerialization : IXmlSerialization
{

    /// <summary>
    /// Serializes and sanitizes a <see cref="PaginationMetaDataDto"/> object to an XML string.
    /// </summary>
    /// <param name="paginationMetaData">The <see cref="PaginationMetaDataDto"/> object to serialize.</param>
    /// <returns>
    /// A sanitized XML string representation of the <see cref="PaginationMetaDataDto"/> object.
    /// </returns>
    public string SerializeAndSanitizeToXml(PaginationMetaDataDto paginationMetaData)
    {
        var xmlSerializer = new XmlSerializer(typeof(PaginationMetaDataDto));
        
        using (var stringWriter = new StringWriter())
        {
            xmlSerializer.Serialize(stringWriter, paginationMetaData);
            var xmlString = stringWriter.ToString();

            var bytes = System.Text.Encoding.UTF8.GetBytes(xmlString);
            var encodedXml = System.Text.Encoding.UTF8.GetString(bytes);
            var sanitizedXml = encodedXml.Replace("\r", "").Replace("\n", "");

            return sanitizedXml;
        }
    }
}