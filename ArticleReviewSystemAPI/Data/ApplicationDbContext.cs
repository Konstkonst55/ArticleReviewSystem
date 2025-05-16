using ArticleReviewSystem.Enums;
using ArticleReviewSystem.Models;
using ArticleReviewSystem.Utils;
using Microsoft.EntityFrameworkCore;

namespace ArticleReviewSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ReviewAssignment> ReviewAssignments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasPostgresEnum<UserRole>("public", "user_role");
            modelBuilder.HasPostgresEnum<ArticleStatus>("public", "article_status");
            modelBuilder.HasPostgresEnum<ReviewDecision>("public", "review_decision");

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.IsBlocked).HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasMany(e => e.ArticlesAuthored)
                      .WithOne(a => a.Author)
                      .HasForeignKey(a => a.AuthorId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.ReviewsDone)
                      .WithOne(r => r.Reviewer)
                      .HasForeignKey(r => r.ReviewerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(e => e.ReviewAssignments)
                      .WithOne(ra => ra.Reviewer)
                      .HasForeignKey(ra => ra.ReviewerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Article>(entity =>
            {
                entity.ToTable("articles");
                entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
                entity.Property(e => e.FilePath).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasMany(e => e.Reviews)
                      .WithOne(r => r.Article)
                      .HasForeignKey(r => r.ArticleId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.ReviewAssignments)
                      .WithOne(ra => ra.Article)
                      .HasForeignKey(ra => ra.ArticleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.ToTable("reviews");
                entity.Property(e => e.Comments).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            modelBuilder.Entity<ReviewAssignment>(entity =>
            {
                entity.ToTable("review_assignments");
                entity.Property(e => e.AssignedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasIndex(ra => new { ra.ArticleId, ra.ReviewerId }).IsUnique();
            });

            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Email = "admin@example.com", FullName = "Admin User", PasswordHash = PasswordHasher.Hash("AdminPass1!"), Role = UserRole.Administrator, IsBlocked = false, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new User { Id = 2, Email = "author1@example.com", FullName = "Author One", PasswordHash = PasswordHasher.Hash("Author1!"), Role = UserRole.Author, CreatedAt = new DateTime(2025, 1, 2, 0, 0, 0, DateTimeKind.Utc) },
                new User { Id = 3, Email = "author2@example.com", FullName = "Author Two", PasswordHash = PasswordHasher.Hash("Author2!"), Role = UserRole.Author, CreatedAt = new DateTime(2025, 1, 3, 0, 0, 0, DateTimeKind.Utc) },
                new User { Id = 4, Email = "reviewer1@example.com", FullName = "Reviewer One", PasswordHash = PasswordHasher.Hash("Review1!"), Role = UserRole.Reviewer, CreatedAt = new DateTime(2025, 1, 4, 0, 0, 0, DateTimeKind.Utc) },
                new User { Id = 5, Email = "reviewer2@example.com", FullName = "Reviewer Two", PasswordHash = PasswordHasher.Hash("Review2!"), Role = UserRole.Reviewer, CreatedAt = new DateTime(2025, 1, 5, 0, 0, 0, DateTimeKind.Utc) }
            );

            modelBuilder.Entity<Article>().HasData(
                new Article { Id = 1, AuthorId = 2, Title = "EF Core Seeding", FilePath = "/files/efcore.pdf", Status = ArticleStatus.NotReviewed, CreatedAt = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Article { Id = 2, AuthorId = 2, Title = "ASP.NET Core Guide", FilePath = "/files/aspnetcore.pdf", Status = ArticleStatus.PendingReviewerAssignment, CreatedAt = new DateTime(2025, 2, 2, 0, 0, 0, DateTimeKind.Utc) },
                new Article { Id = 3, AuthorId = 3, Title = "C# Advanced Topics", FilePath = "/files/csharp.pdf", Status = ArticleStatus.UnderReview, CreatedAt = new DateTime(2025, 2, 3, 0, 0, 0, DateTimeKind.Utc) },
                new Article { Id = 4, AuthorId = 3, Title = "PostgreSQL Integration", FilePath = "/files/pgsql.pdf", Status = ArticleStatus.SentForRevision, CreatedAt = new DateTime(2025, 2, 4, 0, 0, 0, DateTimeKind.Utc) },
                new Article { Id = 5, AuthorId = 2, Title = "Dependency Injection in .NET", FilePath = "/files/di.pdf", Status = ArticleStatus.AcceptedForPublication, CreatedAt = new DateTime(2025, 2, 5, 0, 0, 0, DateTimeKind.Utc) }
            );

            modelBuilder.Entity<ReviewAssignment>().HasData(
                new ReviewAssignment { Id = 1, ArticleId = 1, ReviewerId = 4, IsAccepted = true, AssignedAt = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc), RespondedAt = new DateTime(2025, 3, 2, 0, 0, 0, DateTimeKind.Utc) },
                new ReviewAssignment { Id = 2, ArticleId = 2, ReviewerId = 4, IsAccepted = null, AssignedAt = new DateTime(2025, 3, 3, 0, 0, 0, DateTimeKind.Utc), RespondedAt = null },
                new ReviewAssignment { Id = 3, ArticleId = 3, ReviewerId = 5, IsAccepted = true, AssignedAt = new DateTime(2025, 3, 4, 0, 0, 0, DateTimeKind.Utc), RespondedAt = new DateTime(2025, 3, 5, 0, 0, 0, DateTimeKind.Utc) },
                new ReviewAssignment { Id = 4, ArticleId = 4, ReviewerId = 5, IsAccepted = false, AssignedAt = new DateTime(2025, 3, 6, 0, 0, 0, DateTimeKind.Utc), RespondedAt = new DateTime(2025, 3, 7, 0, 0, 0, DateTimeKind.Utc) },
                new ReviewAssignment { Id = 5, ArticleId = 5, ReviewerId = 4, IsAccepted = true, AssignedAt = new DateTime(2025, 3, 8, 0, 0, 0, DateTimeKind.Utc), RespondedAt = new DateTime(2025, 3, 9, 0, 0, 0, DateTimeKind.Utc) }
            );

            modelBuilder.Entity<Review>().HasData(
                new Review { Id = 1, ArticleId = 1, ReviewerId = 4, Decision = ReviewDecision.AcceptedForPublication, Comments = "Отличная статья!", CreatedAt = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Review { Id = 2, ArticleId = 2, ReviewerId = 4, Decision = ReviewDecision.SentForRevision, Comments = "Нужны небольшие правки по стилю.", CreatedAt = new DateTime(2025, 4, 2, 0, 0, 0, DateTimeKind.Utc) },
                new Review { Id = 3, ArticleId = 3, ReviewerId = 5, Decision = ReviewDecision.Rejected, Comments = "Работа не соответствует теме.", CreatedAt = new DateTime(2025, 4, 3, 0, 0, 0, DateTimeKind.Utc) },
                new Review { Id = 4, ArticleId = 5, ReviewerId = 4, Decision = ReviewDecision.AcceptedForPublication, Comments = "Готово к публикации.", CreatedAt = new DateTime(2025, 4, 4, 0, 0, 0, DateTimeKind.Utc) },
                new Review { Id = 5, ArticleId = 4, ReviewerId = 5, Decision = ReviewDecision.SentForRevision, Comments = "Допишите раздел с примерами.", CreatedAt = new DateTime(2025, 4, 5, 0, 0, 0, DateTimeKind.Utc) }
            );
        }
    }
}
