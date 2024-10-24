using System.Xml.Serialization;

namespace Haiku.API.Dtos
{
    [XmlRoot("PaginationMetaDataDto")]
    public class PaginationMetaDataDto
    {
        [XmlElement("totalCount")]
        public int TotalCount { get; set; }

        [XmlElement("pageSize")]
        public int PageSize { get; set; }

        [XmlElement("currentPage")]
        public int CurrentPage { get; set; }

        [XmlElement("totalPages")]
        public int TotalPages { get; set; }
    }
}
