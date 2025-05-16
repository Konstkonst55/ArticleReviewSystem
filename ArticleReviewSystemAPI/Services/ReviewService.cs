using ArticleReviewSystem.Data;
using ArticleReviewSystem.Enums;
using ArticleReviewSystem.Interfaces;
using ArticleReviewSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDbContext _context;

        public ReviewService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Review> CreateAsync(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var article = await _context.Articles.FindAsync(review.ArticleId);
            if (article != null)
            {
                article.Status = review.Decision switch
                {
                    ReviewDecision.AcceptedForPublication => ArticleStatus.AcceptedForPublication,
                    ReviewDecision.SentForRevision => ArticleStatus.SentForRevision,
                    ReviewDecision.Rejected => ArticleStatus.Rejected,
                    _ => article.Status
                };

                await _context.SaveChangesAsync();
            }

            return review;
        }

        public async Task<IEnumerable<Review>> GetReviewsByArticleIdAsync(int articleId)
        {
            return await _context.Reviews
                .Where(r => r.ArticleId == articleId)
                .Include(r => r.Reviewer)
                .ToListAsync();
        }
    }

}
