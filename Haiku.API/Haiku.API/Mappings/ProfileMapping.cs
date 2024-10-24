using Haiku.API.Dtos;
using ProfileMapper = AutoMapper.Profile;
using Profile = Haiku.API.Models.Profile;

namespace Haiku.API.Mapping
{
    public class ProfileMapping : ProfileMapper
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ProfileMapping"/> class.
        /// </summary>
        public ProfileMapping()
        {
            CreateMap<Profile, ProfileDto>();
            CreateMap<ProfileDto, Profile>();
        }
    }
}
