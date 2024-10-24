using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Haiku.API.Models
{
    public class Role
    {
        [Key]
        [Column]
        public long Id { get; set; }
    
        [Required]
        [Column]
        public required string Title { get; set; }

        public virtual ICollection<User> Users { get; set; } = new List<User>();

    }
}
