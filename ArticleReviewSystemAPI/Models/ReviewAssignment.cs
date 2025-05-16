using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArticleReviewSystem.Models
{
    public class ReviewAssignment
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("article_id")]
        public int ArticleId { get; set; }

        [Column("reviewer_id")]
        public int ReviewerId { get; set; }

        [Column("is_accepted")]
        public bool? IsAccepted { get; set; } // null = в ожидании, true = принято, false = отклонено

        [Column("assigned_at")]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        [Column("responded_at")] // Новое поле: время ответа рецензента
        public DateTime? RespondedAt { get; set; }


        // Навигационные свойства
        [ForeignKey("ArticleId")]
        public virtual Article Article { get; set; }
        [ForeignKey("ReviewerId")]
        public virtual User Reviewer { get; set; }
    }
}
