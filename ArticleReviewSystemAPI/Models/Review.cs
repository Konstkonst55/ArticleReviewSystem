using ArticleReviewSystem.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArticleReviewSystem.Models
{
    public class Review
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("article_id")]
        public int ArticleId { get; set; }

        [Column("reviewer_id")]
        public int ReviewerId { get; set; }

        [Column("decision")]
        public ReviewDecision Decision { get; set; }

        [Required]
        [Column("comments")]
        public string Comments { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        [ForeignKey("ArticleId")]
        public virtual Article Article { get; set; }
        [ForeignKey("ReviewerId")]
        public virtual User Reviewer { get; set; }
    }
}
