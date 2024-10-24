using Haiku.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Haiku.API.Services.ImageServices;

namespace Haiku.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;
        private readonly ILogger<ImageController> _logger;

        public ImageController(IImageService imageService, ILogger<ImageController> logger)
        {
            _imageService = imageService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a specific <see cref="Image"/> by their unique identifier.
        /// </summary>
        /// <param name="imageId">The unique identifier of the <see cref="Image"/> to retrieve.</param>
        /// <returns>
        /// An <see cref="ActionResult{ImageDto}"/> containing the <see cref="Image"/> details if found,
        /// or a 404 Not Found status if the <see cref="Image"/> does not exist.
        /// </returns>
        [HttpGet("{imageId}", Name = "ImageDetails")]
        [Produces("application/xml")]
        public async Task<ActionResult<ImageDto>> GetImageByIdAsync(long imageId)
        {
            var imageDto = await _imageService.GetImageByIdAsync(imageId);
            return Ok(imageDto);
        }

        /// <summary>
        /// Uploads a new image for a user, replacing the current image if one exists.
        /// </summary>
        /// <param name="file">The <see cref="IFormFile"/> representing the image to upload.</param>
        /// <param name="currentImageId">The ID of the current image to replace and delete.</param>
        /// <param name="currentUserId">The ID of the user uploading the image.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the result of the operation.
        /// Returns <see cref="NoContentResult"/> if the upload is successful, or a <see cref="BadRequestResult"/>
        /// if no file is provided.
        /// </returns>
        [HttpPost("upload-image/{currentImageId}/{currentUserId}")]
        [Authorize]
        public async Task<IActionResult> PostImageAsync(IFormFile file, long currentImageId, long currentUserId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            await _imageService.AddImageAsync(file, currentImageId, currentUserId);

            return NoContent();
        }

        /// <summary>
        /// Deletes an <see cref="Image"/> specified by their ID.
        /// </summary>
        /// <param name="imageId">The ID of the <see cref="Image"/>  to delete.</param>
        /// <returns>
        /// An <see cref="IActionResult"/> indicating the outcome of the delete operation.
        /// Returns 204 No Content on a successful deletion,
        /// or 404 Not Found if the <see cref="Image"/> does not exist.
        /// </returns>
        [HttpDelete("{imageId}")]
        [Produces("application/xml")]
        [Authorize]
        public async Task<IActionResult> DeleteImageAsync(long imageId)
        {
            await _imageService.DeleteImageByIdAsync(imageId);

            return NoContent();
        }
    }
}
