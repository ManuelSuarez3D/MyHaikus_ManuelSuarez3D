using System.ComponentModel.DataAnnotations;

namespace Haiku.API.Models
{
    public class Image
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public required string FilePath { get; set; }

        public virtual ICollection<Profile> Profiles { get; set; } = new List<Profile>();
    }
}
