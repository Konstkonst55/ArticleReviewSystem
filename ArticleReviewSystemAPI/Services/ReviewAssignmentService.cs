using ArticleReviewSystem.Data;
using ArticleReviewSystem.Enums;
using ArticleReviewSystem.Interfaces;
using ArticleReviewSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.Services
{
    public class ReviewAssignmentService : IReviewAssignmentService
    {
        private readonly ApplicationDbContext _context;

        public ReviewAssignmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AssignReviewerAsync(int articleId, int reviewerId)
        {
            var exists = await _context.ReviewAssignments.AnyAsync(r =>
                r.ArticleId == articleId && r.ReviewerId == reviewerId);

            if (exists) return false;

            var assignment = new ReviewAssignment
            {
                ArticleId = articleId,
                ReviewerId = reviewerId,
                AssignedAt = DateTime.UtcNow,
                IsAccepted = null
            };

            _context.ReviewAssignments.Add(assignment);

            var article = await _context.Articles.FindAsync(articleId);
            if (article != null)
            {
                article.Status = ArticleStatus.PendingReviewerAcceptance;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ReviewAssignment>> GetAssignmentsForReviewerAsync(int reviewerId)
        {
            return await _context.ReviewAssignments
                .Where(r => r.ReviewerId == reviewerId)
                .Include(r => r.Article)
                .ToListAsync();
        }

        public async Task<bool> RespondToAssignmentAsync(int assignmentId, bool isAccepted)
        {
            var assignment = await _context.ReviewAssignments.FindAsync(assignmentId);
            if (assignment == null) return false;

            assignment.IsAccepted = isAccepted;
            assignment.RespondedAt = DateTime.UtcNow;

            var article = await _context.Articles.FindAsync(assignment.ArticleId);
            if (article != null && isAccepted)
            {
                article.Status = ArticleStatus.UnderReview;
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }

}
