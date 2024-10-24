using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Haiku.API.Models
{
    public class Profile
    {
        [Key]
        [Column]
        public long Id { get; set; }

        public string? Bio { get; set; }

        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        public long? ImageId { get; set; }

        [ForeignKey("ImageId")]
        public virtual Image? Image { get; set; }
    }
}
