using ProfileMapper = AutoMapper.Profile;
using Haiku.API.Dtos;
using Haiku.API.Models;

namespace Haiku.API.Mapping
{
    public class UserHaikuMapping : ProfileMapper
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UserHaikuMapping"/> class.
        /// </summary>
        public UserHaikuMapping()
        {
            CreateMap<UserHaiku, UserHaikuDto>();
            CreateMap<UserHaikuDto, UserHaiku>();
        }
    }
}
