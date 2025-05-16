using ArticleReviewSystem.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArticleReviewSystem.Models
{
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [Column("password_hash")]
        public string PasswordHash { get; set; }

        [Required]
        [Column("full_name")]
        public string FullName { get; set; }

        [Column("is_blocked")]
        public bool IsBlocked { get; set; } = false;

        [Required]
        [Column("role")]
        public UserRole Role { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Article> ArticlesAuthored { get; set; } = new List<Article>();
        public virtual ICollection<Review> ReviewsDone { get; set; } = new List<Review>();
        public virtual ICollection<ReviewAssignment> ReviewAssignments { get; set; } = new List<ReviewAssignment>();
    }
}
