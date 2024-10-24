namespace Haiku.API.Models
{
    public class Image
    {
        public long Id { get; set; }
        public required string FilePath { get; set; }
        public virtual ICollection<Profile> Profiles { get; set; } = new List<Profile>();
    }
}
