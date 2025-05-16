using ArticleReviewSystem.Data;
using ArticleReviewSystem.Interfaces;
using ArticleReviewSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.Services
{
    public class ArticleService : IArticleService
    {
        private readonly ApplicationDbContext _context;

        public ArticleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Article> CreateAsync(Article article)
        {
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return false;

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Article>> GetAllAsync() =>
            await _context.Articles.Include(a => a.Author).ToListAsync();

        public async Task<Article?> GetByIdAsync(int id) =>
            await _context.Articles.Include(a => a.Author)
                                   .Include(a => a.Reviews)
                                   .Include(a => a.ReviewAssignments)
                                   .FirstOrDefaultAsync(a => a.Id == id);

        public async Task<bool> UpdateAsync(Article article)
        {
            if (!_context.Articles.Any(a => a.Id == article.Id)) return false;
            _context.Articles.Update(article);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
