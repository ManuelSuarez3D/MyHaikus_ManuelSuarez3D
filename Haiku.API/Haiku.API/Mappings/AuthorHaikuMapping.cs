using ProfileMapper = AutoMapper.Profile;
using Haiku.API.Dtos;
using Haiku.API.Models;

namespace Haiku.API.Mapping
{
    public class AuthorHaikuMapping : ProfileMapper
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AuthorHaikuMapping"/> class.
        /// </summary>
        public AuthorHaikuMapping()
        {
            CreateMap<AuthorHaiku, AuthorHaikuDto>();
            CreateMap<AuthorHaikuDto, AuthorHaiku>();
        }
    }
}
