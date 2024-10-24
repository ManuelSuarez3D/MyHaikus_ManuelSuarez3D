using Haiku.API.Models;

namespace Haiku.API.Repositories.ImageRepositories
{
    public interface IImageRepository
    {
        Task<Image?> GetImageByIdAsync(long imageId);
        Task<Image> AddImageAsync(Image newImage);
        Task<int> DeleteImageByIdAsync(long imageId);
        Task<bool> ImageExistsByIdAsync(long imageId);
    }
}

