using Haiku.API.Dtos;

namespace Haiku.API.Services.ImageServices
{
    public interface IImageService
    {
        Task<ImageDto> GetImageByIdAsync(long imageId);
        Task AddImageAsync(IFormFile file, long currentImageId, long currentUser);
        Task DeleteImageByIdAsync(long imageId);
        Task<bool> ImageExistsByIdAsync(long imageId);
    }
}
