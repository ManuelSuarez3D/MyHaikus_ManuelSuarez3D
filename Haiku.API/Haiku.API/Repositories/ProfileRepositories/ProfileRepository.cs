using Microsoft.EntityFrameworkCore;
using Haiku.API.Models;
using Haiku.API.Database;

namespace Haiku.API.Repositories.ProfileRepositories
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly HaikuAPIContext _context;

        public ProfileRepository(HaikuAPIContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all user profiles that match the provided list of user IDs asynchronously.
        /// </summary>
        /// <param name="userIds">A list of user IDs for which the user profiles are to be fetched.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains an <see cref="IEnumerable{Profile}"/>
        /// representing the list of user profiles matching the provided user IDs.
        /// </returns>
        public async Task<IEnumerable<Profile>> GetAllProfilesByUserIdsAsync(List<long> userIds)
        {
            return await _context.Profiles
                                 .Where(profile => userIds.Contains(profile.UserId))
                                 .ToListAsync();
        }

        /// <summary>
        /// Retrieves the total count of <see cref="Profile"/> entities in the database,
        /// </summary>
        /// <param name="searchOption">An optional search term to filter the <see cref="Author"/> entities by title.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the total count of <see cref="Author"/> entities.</returns>
        public async Task<int> GetTotalProfilesAsync()
        {
            return await _context.Profiles.CountAsync();
        }

        /// <summary>
        /// Retrieves an <see cref="Profile"/> entity by its unique identifier.
        /// </summary>
        /// <param name="profileId">The unique identifier of the <see cref="Profile"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="Profile"/> entity if found; otherwise, <c>null</c>.</returns>
        public async Task<Profile?> GetProfileByIdAsync(long profileId)
        {
            return await _context.Profiles.FindAsync(profileId);
        }

        /// <summary>
        /// Retrieves an <see cref="Profile"/> entity by its <see cref="User"/> unique identifier.
        /// </summary>
        /// <param name="userId">The unique identifier of the <see cref="Profile"/> <see cref="User"/> to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="Profile"/> entity if found; otherwise, <c>null</c>.</returns>
        public async Task<Profile?> GetProfileByUserIdAsync(long userId)
        {
            return await _context.Profiles
                .FirstOrDefaultAsync(profile => profile.UserId == userId);
        }

        /// <summary>
        /// Adds a new <see cref="Profile"/> to the database asynchronously.
        /// </summary>
        /// <param name="newProfile">The <see cref="Profile"/> entity to be added.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the added <see cref="Profile"/> entity.</returns>
        public async Task<Profile> AddProfileAsync(Profile newProfile)
        {
            var entity = await _context.Profiles.AddAsync(newProfile);
            await _context.SaveChangesAsync();
            return entity.Entity;
        }

        /// <summary>
        /// Updates an existing <see cref="Profile"/> entry.
        /// </summary>
        /// <param name="updatedProfile">The <see cref="Profile"/> entry to update. Must not be null.</param>
        /// <returns>Integer result indicating number of rows affected, if <see cref="Profile"/> was updated.</returns>
        public async Task<int> UpdateProfileAsync(Profile updatedProfile)
        {
            _context.Profiles.Attach(updatedProfile);
            _context.Entry(updatedProfile).State = EntityState.Modified;
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Checks if an <see cref="Profile"/> entity exists by its ID asynchronously.
        /// </summary>
        /// <param name="profileId">The ID of the <see cref="Profile"/> entity to check for existence.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the <see cref="Profile"/> exists.</returns>
        public async Task<bool> ProfileExistsByIdAsync(long profileId)
        {
            return await _context.Profiles.AnyAsync(e => e.Id == profileId);
        }
    }
}
