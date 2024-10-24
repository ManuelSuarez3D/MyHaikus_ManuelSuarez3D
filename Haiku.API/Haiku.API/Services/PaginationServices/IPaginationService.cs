using Haiku.API.Dtos;

namespace Haiku.API.Services.PaginationService
{
    public interface IPaginationService
    {
       PaginationMetaDataDto GetPaginationMetaData(int totalLogs, int pageSize, int pageNumber);
    }
}
