using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Haiku.API.Models
{
    public class User
    {
        [Key]
        [Column]
        public long Id { get; set; }

        [Required]
        [Column]
        [StringLength(20, ErrorMessage = "Username length can't be more than 20 characters.")]
        [MinLength(4, ErrorMessage = "Username length must be at least 4 characters.")]
        public required string Username { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(256)")]
        [StringLength(20, ErrorMessage = "Password length can't be more than 20 characters.")]
        [MinLength(8, ErrorMessage = "Password length must be at least 8 characters.")]
        public required string Password { get; set; }

        [Required]
        public long RoleId { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role? UserRole { get; set; }

        public virtual Profile? Profile { get; set; }

        public virtual ICollection<UserHaiku> UserHaikus { get; set; } = new List<UserHaiku>();
    }
}
