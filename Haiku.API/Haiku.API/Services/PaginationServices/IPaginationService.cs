using Haiku.API.Dtos;

namespace Haiku.API.Utilities.PaginationUtilities
{
    public interface IPaginationService
    {
        PaginationMetaDataDto GetPaginationMetaData(int totalLogs, int pageSize, int pageNumber);
    }
}
