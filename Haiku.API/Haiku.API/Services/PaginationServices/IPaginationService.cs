using Haiku.API.Dtos;

namespace Haiku.API.Services.PaginationServices
{
    public interface IPaginationService
    {
        PaginationMetaDataDto GetPaginationMetaData(int totalLogs, int pageSize, int pageNumber);
    }
}
