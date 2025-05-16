using ArticleReviewSystem.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArticleReviewSystem.Models
{
    public class Article
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("author_id")]
        public int AuthorId { get; set; }

        [Required]
        [Column("title")]
        public string Title { get; set; }

        [Required]
        [Column("file_path")]
        public string FilePath { get; set; }

        [Column("status")]
        public ArticleStatus Status { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("AuthorId")]
        public virtual User Author { get; set; }
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<ReviewAssignment> ReviewAssignments { get; set; } = new List<ReviewAssignment>();
    }
}
