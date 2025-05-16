using ArticleReviewSystem.Data;
using ArticleReviewSystem.Interfaces;
using ArticleReviewSystem.Models;
using ArticleReviewSystem.Utils;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> AuthenticateAsync(string email, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user == null || !PasswordHasher.Verify(password, user.PasswordHash))
                return null;

            return user;
        }

        public async Task<User> CreateAsync(User user, string password)
        {
            user.PasswordHash = PasswordHasher.Hash(password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<User>> GetAllAsync() =>
            await _context.Users.ToListAsync();

        public async Task<User?> GetByIdAsync(int id) =>
            await _context.Users.FindAsync(id);

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                                 .SingleOrDefaultAsync(u => u.Email == email);
        }
    }
}
