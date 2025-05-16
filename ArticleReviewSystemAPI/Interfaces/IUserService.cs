using ArticleReviewSystem.Models;

namespace ArticleReviewSystem.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetByIdAsync(int id);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(User user, string password);
        Task<bool> DeleteAsync(int id);
        Task<User?> AuthenticateAsync(string email, string password);
    }

}
