using Haiku.API.Dtos;

namespace Haiku.API.Services.XmlSerializationServices
{
    public interface IXmlSerializationService
    {
        string SerializeAndSanitizeToXml(PaginationMetaDataDto paginationMetaData);
    }
}
