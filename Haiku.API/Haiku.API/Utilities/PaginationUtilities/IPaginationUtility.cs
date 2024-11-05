using Haiku.API.Dtos;

namespace Haiku.API.Utilities.PaginationUtilities
{
    public interface IPaginationUtility
    {
        PaginationMetaDataDto GetPaginationMetaData(int totalLogs, int pageSize, int pageNumber);
    }
}
