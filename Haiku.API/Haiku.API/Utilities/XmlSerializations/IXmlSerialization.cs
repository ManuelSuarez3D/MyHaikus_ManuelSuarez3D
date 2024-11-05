using Haiku.API.Dtos;

namespace Haiku.API.Services.XmlSerialization
{
    public interface IXmlSerialization
    {
        string SerializeAndSanitizeToXml(PaginationMetaDataDto paginationMetaData);
    }
}
