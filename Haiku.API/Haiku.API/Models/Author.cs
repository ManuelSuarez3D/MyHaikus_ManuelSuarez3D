using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Haiku.API.Models
{
    public class Author
    {
        [Key]
        [Column]
        public long Id { get; set; }

        [Required]
        [Column]
        [StringLength(50, ErrorMessage = "Name length can't be more than 50 characters.")]
        [MinLength(2, ErrorMessage = "Name length must be at least 2 characters.")]
        public required string Name { get; set; }

        [Column]
        [StringLength(1000, ErrorMessage = "Bio length can't be more than 300 characters.")]
        [MinLength(4, ErrorMessage = "Name length must be at least 4 characters.")]
        public string? Bio { get; set; }

        public virtual ICollection<AuthorHaiku> AuthorHaikus { get; set; } = new List<AuthorHaiku>();

    }
}
