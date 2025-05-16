using ArticleReviewSystem.Models;

namespace ArticleReviewSystem.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetReviewsByArticleIdAsync(int articleId);
        Task<Review> CreateAsync(Review review);
    }
}
