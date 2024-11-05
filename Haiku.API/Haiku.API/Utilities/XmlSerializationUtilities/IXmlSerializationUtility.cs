using Haiku.API.Dtos;

namespace Haiku.API.Utilities.XmlSerializationUtilities
{
    public interface IXmlSerializationUtility
    {
        string SerializeAndSanitizeToXml(PaginationMetaDataDto paginationMetaData);
    }
}
