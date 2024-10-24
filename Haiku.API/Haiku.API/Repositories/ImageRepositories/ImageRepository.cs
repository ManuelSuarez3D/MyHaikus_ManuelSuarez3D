using Haiku.API.Database;
using Haiku.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Haiku.API.Repositories.ImageRepositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly HaikuAPIContext _context;

        public ImageRepository(HaikuAPIContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves an <see cref="Image"/> entity by its unique identifier.
        /// </summary>
        /// <param name="imageId">The unique identifier of the <see cref="Image"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="Image"/> entity if found; otherwise, <c>null</c>.</returns>
        public async Task<Image?> GetImageByIdAsync(long imageId)
        {
            return await _context.Images.FindAsync(imageId);
        }

        /// <summary>
        /// Adds a new <see cref="Image"/> to the database asynchronously.
        /// </summary>
        /// <param name="newImage">The <see cref="Image"/> entity to be added.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the added <see cref="Image"/> entity.</returns>
        public async Task<Image> AddImageAsync(Image newImage)
        {
            var newEntity = await _context.Images.AddAsync(newImage);
            await _context.SaveChangesAsync();
            return newEntity.Entity;
        }

        /// <summary>
        /// Deletes an existing <see cref="Image"/> entry.
        /// </summary>
        /// <param name="imageId">The ID of the <see cref="Image"/> entry to delete.</param>
        /// <returns>Integer result indicating number of rows affected, if <see cref="Image"/> was deleted.</returns>
        public async Task<int> DeleteImageByIdAsync(long imageId)
        {
            var image = await _context.Images.FindAsync(imageId);

            if (image == null)
                return 0;

            _context.Images.Remove(image);
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Checks if an <see cref="Image"/> entity exists by its ID asynchronously.
        /// </summary>
        /// <param name="imageId">The ID of the <see cref="Image"/> entity to check for existence.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="Image"/> exists.</returns>
        public async Task<bool> ImageExistsByIdAsync(long imageId)
        {
            return await _context.Images.AnyAsync(e => e.Id == imageId);
        }
    }
}
