using AutoMapper;
using Haiku.API.Dtos;
using Haiku.API.Exceptions;
using Haiku.API.Models;
using Haiku.API.Repositories.ImageRepositories;
using Haiku.API.Services.IProfileServices;
using Haiku.API.Utilities.UnitOfWorks;


namespace Haiku.API.Services.ImageServices
{
    public class ImageService : IImageService
    {
        private readonly IImageRepository _imageRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private const long DefaultImageId = 1;
        private const string defaultUrl = "http://localhost:5104";

        public ImageService(IImageRepository imageRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _imageRepository = imageRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves an <see cref="Image"/> by their unique identifier.
        /// </summary>
        /// <param name="imageId">The unique identifier of the <see cref="Image"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the corresponding <see cref="ImageDto"/>.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Image"/> with the specified ID is not found.</exception>
        /// <exception cref="NotRetrievedException">
        /// Thrown when the <see cref="Author"/> cannot be retrieved.
        /// </exception>
        public async Task<ImageDto> GetImageByIdAsync(long imageId)
        {
            if (!await ImageExistsByIdAsync(imageId))
                throw new NotFoundException($"Image with ID: {imageId}, was not found.");

            var existingImage = await _imageRepository.GetImageByIdAsync(imageId);

            if (existingImage == null)
                throw new NotRetrievedException($"Image with ID: {imageId}, was not retrieved.");

            var existingImageDto = _mapper.Map<ImageDto>(existingImage);

            return existingImageDto;
        }

        /// <summary>
        /// Adds a new <see cref="Image"/> to the system, associates it with a profile, 
        /// and removes the previously associated image (if applicable).
        /// </summary>
        /// <param name="file">The <see cref="IFormFile"/> containing the image to add.</param>
        /// <param name="currentImageId">The ID of the current image associated with the profile. If not the default image, the existing image will be removed and replaced with the new one.</param>
        /// <param name="profileId">The ID of the profile to associate the new image with.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="ArgumentException">Thrown when the <paramref name="file"/> is null or empty.</exception>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Image"/> or profile cannot be found.</exception>
        /// <exception cref="NotRetrievedException">Thrown when the <see cref="Image"/> or profile could not be retrieved.</exception>
        /// <exception cref="NotSavedException">Thrown when the <see cref="Image"/> or profile cannot be saved successfully.</exception>
        /// <exception cref="Exception">Thrown when an unexpected error occurs during the transaction.</exception>
        public async Task AddImageAsync(IFormFile file, long currentImageId, long profileId)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File cannot be null or empty.", nameof(file));
            }

            Image newImage = null;

            await _unitOfWork.BeginTransactionAsync();
            try
            {
                if (!await ImageExistsByIdAsync(currentImageId))
                    throw new NotFoundException($"Image with ID: {currentImageId}, was not found.");

                if (!await _unitOfWork.Profiles.ProfileExistsByIdAsync(profileId))
                    throw new NotFoundException($"Profile with ID: {profileId}, was not found.");

                if (currentImageId != DefaultImageId)
                {
                    var previousImage = await _imageRepository.GetImageByIdAsync(currentImageId);

                    if (previousImage == null)
                        throw new NotRetrievedException($"Image with ID: {currentImageId}, was not retrieved.");

                    var previousImagePath = Path.Combine("wwwroot/images", Path.GetFileName(previousImage.FilePath));
                    if (File.Exists(previousImagePath))
                    {
                        File.Delete(previousImagePath);
                    }

                    await DeleteImageByIdAsync(previousImage.Id);
                }

                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var uploadPath = Path.Combine("wwwroot/images", fileName);
                using (var stream = new FileStream(uploadPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                newImage = new Image
                {
                    FilePath = $"{defaultUrl}/images/{fileName}"
                };

                var createdEntity = await _imageRepository.AddImageAsync(newImage);

                if (createdEntity == null || createdEntity.Id <= 0)
                    throw new NotSavedException($"{fileName}, was not saved succesfully");

                var currentProfile = await _unitOfWork.Profiles.GetProfileByIdAsync(profileId);

                if (currentProfile == null)
                    throw new NotRetrievedException($"Profile with ID: {profileId}, was not retrieved.");

                currentProfile.ImageId = newImage.Id;
                var rowsAffected = await _unitOfWork.Profiles.UpdateProfileAsync(currentProfile);

                if (rowsAffected <= 0)
                    throw new NotSavedException($"Profile with ID: {profileId}, was not updated succesfully");

                await _unitOfWork.CompleteAsync();
                await _unitOfWork.CommitAsync();
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        /// <summary>
        /// Deletes an <see cref="Image"/> by their unique identifier.
        /// </summary>
        /// <param name="imageId">The unique identifier of the <see cref="Image"/> to be deleted.</param>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <exception cref="NotFoundException">Thrown when the <see cref="Image"/> with the specified ID is not found.</exception>
        /// <exception cref="NotSavedException">Thrown when not the associated <see cref="Image"/> was not deleted.</exception>
        public async Task DeleteImageByIdAsync(long imageId)
        {
            if (!await ImageExistsByIdAsync(imageId))
                throw new NotFoundException($"Image with ID: {imageId}, was not found.");

            var imageRowsAffected = await _imageRepository.DeleteImageByIdAsync(imageId);

            if (imageRowsAffected <= 0)
                throw new NotSavedException($"Image with ID: {imageId}, was not deleted succesfully");
        }

        /// <summary>
        /// Checks whether an <see cref="Image"/> exists in the repository by their unique identifier.
        /// </summary>
        /// <param name="imageId">The unique identifier of the <see cref="Image"/> to check.</param>
        /// <returns>A task that represents the asynchronous operation, containing a boolean value indicating whether the <see cref="Image"/> exists.</returns>
        public async Task<bool> ImageExistsByIdAsync(long imageId)
        {
            if (!await _imageRepository.ImageExistsByIdAsync(imageId))
                return false;

            return true;
        }
    }
}