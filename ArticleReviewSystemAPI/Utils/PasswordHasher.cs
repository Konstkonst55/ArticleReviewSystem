using System.Security.Cryptography;
using System.Text;

namespace ArticleReviewSystem.Utils
{
    public static class PasswordHasher
    {
        private static readonly string _key;

        static PasswordHasher()
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                .Build();

            _key = config["PasswordHashing:Key"]
                   ?? throw new InvalidOperationException("Password hashing key is not configured.");
        }

        public static string Hash(string password)
        {
            if (password is null)
                throw new ArgumentNullException(nameof(password));

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_key));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            var sb = new StringBuilder(hashBytes.Length * 2);
            foreach (var b in hashBytes)
                sb.Append(b.ToString("x2"));
            return sb.ToString();
        }

        public static bool Verify(string password, string storedHash)
        {
            if (password is null)
                throw new ArgumentNullException(nameof(password));
            if (storedHash is null)
                throw new ArgumentNullException(nameof(storedHash));

            var computedHash = Hash(password);

            byte[] computedBytes = Convert.FromHexString(computedHash);
            byte[] storedBytes = Convert.FromHexString(storedHash);

            if (computedBytes.Length != storedBytes.Length)
                return false;

            return CryptographicOperations.FixedTimeEquals(computedBytes, storedBytes);
        }
    }
}
