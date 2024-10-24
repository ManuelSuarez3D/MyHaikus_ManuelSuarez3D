using Haiku.API.Dtos;

namespace Haiku.API.Services.PaginationService
{
    public class PaginationService : IPaginationService
    {
        /// <summary>
        /// Calculates pagination metadata for a collection of logs.
        /// </summary>
        /// <param name="totalLogs">The total number of logs available.</param>
        /// <param name="pageSize">The number of logs to display per page.</param>
        /// <param name="pageNumber">The current page number.</param>
        /// <returns>A <see cref="PaginationMetaDataDto"/> object containing pagination information.</returns>
        public PaginationMetaDataDto GetPaginationMetaData(int totalLogs, int pageSize, int pageNumber)
        {
            return new PaginationMetaDataDto
            {
                TotalCount = totalLogs,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling((double)totalLogs / pageSize)
            };
        }
    }
}
