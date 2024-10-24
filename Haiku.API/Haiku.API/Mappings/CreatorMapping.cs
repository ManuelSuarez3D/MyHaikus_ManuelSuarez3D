using ProfileMapper = AutoMapper.Profile;
using Haiku.API.Dtos;
using Haiku.API.Models;

namespace Haiku.API.Mapping
{
    public class AuthorMapping : ProfileMapper
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AuthorMapping"/> class.
        /// </summary>
        public AuthorMapping()
        {
            CreateMap<Author, AuthorDto>();
            CreateMap<AuthorDto, Author>();
        }
    }
}