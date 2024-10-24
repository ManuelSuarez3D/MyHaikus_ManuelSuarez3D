using Haiku.API.Utilities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Haiku.API.Models
{
    public class AuthorHaiku
    {
        [Key]
        [Column]
        public long Id { get; set; }

        [Column]
        [StringLength(100, ErrorMessage = "Title length can't be more than 100.")]
        [MinLength(4, ErrorMessage = "Title length must be at least 4 characters.")]
        public string? Title { get; set; }

        [Required]
        [Column]
        [SyllableCount(5, ErrorMessage = "Must be five syllables")]
        public required string LineOne { get; set; }

        [Required]
        [Column]
        [SyllableCount(7, ErrorMessage = "Must be seven syllables")]
        public required string LineTwo { get; set; }

        [Required]
        [Column]
        [SyllableCount(5, ErrorMessage = "Must be five syllables")]
        public required string LineThree { get; set; }

        public long? AuthorId { get; set; } = 1;

        [ForeignKey("AuthorId")]
        public Author? Author { get; set; }
    }
}

