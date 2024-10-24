using ProfileMapper = AutoMapper.Profile;
using Haiku.API.Dtos;
using Haiku.API.Models;

namespace Haiku.API.Mapping
{
    public class ImageMapping : ProfileMapper
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ImageMapping"/> class.
        /// </summary>
        public ImageMapping()
        {
            CreateMap<Image, ImageDto>();
            CreateMap<ImageDto, Image>();
        }
    }
}
