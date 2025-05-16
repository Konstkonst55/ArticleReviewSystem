using ArticleReviewSystem.Enums;

namespace ArticleReviewSystem.DTOs
{
    public class AuthDtos
    {
        public record RegisterRequest(string Email, string Password, string FullName, UserRole Role);
        public record LoginRequest(string Email, string Password);
        public record AuthResponse(string Token, DateTime Expires);

    }
}
