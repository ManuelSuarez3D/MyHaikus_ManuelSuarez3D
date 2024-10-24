using ProfileMapper = AutoMapper.Profile;
using Haiku.API.Dtos;
using Haiku.API.Models;

namespace Haiku.API.Mapping
{
    public class UserMapping : ProfileMapper
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UserMapping"/> class.
        /// </summary>
        public UserMapping()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<RegisterDto, User>();
            CreateMap<LoginDto, User>();
        }  
    }
}
