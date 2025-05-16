using ArticleReviewSystem.Data;
using ArticleReviewSystem.Enums;
using ArticleReviewSystem.Interfaces;
using ArticleReviewSystem.Models;
using ArticleReviewSystem.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static ArticleReviewSystem.DTOs.AuthDtos;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
        npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(30), errorCodesToAdd: null)
    )
);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole(UserRole.Administrator.ToString()));
    options.AddPolicy("AuthorOnly", policy => policy.RequireRole(UserRole.Author.ToString()));
    options.AddPolicy("ReviewerOnly", policy => policy.RequireRole(UserRole.Reviewer.ToString()));
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IReviewAssignmentService, ReviewAssignmentService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/register", async (
    IUserService userService,
    RegisterRequest req) =>
{
    if (await userService.GetByEmailAsync(req.Email) != null)
        return Results.Conflict($"Пользователь с email '{req.Email}' уже существует.");

    var user = new User
    {
        Email = req.Email,
        FullName = req.FullName,
        Role = req.Role,
    };

    var created = await userService.CreateAsync(user, req.Password);

    return Results.Created($"/api/users/{created.Id}", new
    {
        created.Id,
        created.Email,
        created.FullName,
        created.Role,
        created.CreatedAt
    });
});

app.MapPost("/api/auth/login", async (
    IUserService userService,
    IConfiguration config,
    LoginRequest req) =>
{
    var user = await userService.AuthenticateAsync(req.Email, req.Password);
    if (user == null)
        return Results.Unauthorized();

    var jwtKey = config["Jwt:Key"]!;
    var jwtIssuer = config["Jwt:Issuer"]!;
    var jwtAud = config["Jwt:Audience"]!;
    var expires = DateTime.UtcNow.AddHours(2);

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString()),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: jwtIssuer,
        audience: jwtAud,
        claims: claims,
        expires: expires,
        signingCredentials: creds
    );

    var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);

    return Results.Ok(new AuthResponse(tokenStr, expires));
});

app.MapGet("/api/users", async (ApplicationDbContext db) =>
    await db.Users.ToListAsync()
).RequireAuthorization("AdminOnly");

app.MapGet("/api/users/{id}", async (int id, ApplicationDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
}).RequireAuthorization();

app.MapPut("/api/users/{id}", async (int id, User updated, ApplicationDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();
    user.FullName = updated.FullName;
    user.IsBlocked = updated.IsBlocked;
    user.Role = updated.Role;
    user.CreatedAt = updated.CreatedAt;
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization("AdminOnly");

app.MapDelete("/api/users/{id}", async (int id, ApplicationDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();
    db.Users.Remove(user);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization("AdminOnly");

app.MapGet("/api/articles", async (ApplicationDbContext db) =>
    await db.Articles.ToListAsync()
).RequireAuthorization();

app.MapGet("/api/articles/{id}", async (int id, ApplicationDbContext db) =>
{
    var article = await db.Articles.FindAsync(id);
    return article is not null ? Results.Ok(article) : Results.NotFound();
}).RequireAuthorization();

app.MapPost("/api/articles", async (Article article, ApplicationDbContext db) =>
{
    db.Articles.Add(article);
    await db.SaveChangesAsync();
    return Results.Created($"/api/articles/{article.Id}", article);
}).RequireAuthorization("AuthorOnly");

app.MapPut("/api/articles/{id}", async (int id, Article updated, ApplicationDbContext db) =>
{
    var article = await db.Articles.FindAsync(id);
    if (article is null) return Results.NotFound();
    article.Title = updated.Title;
    article.Status = updated.Status;
    article.CreatedAt = updated.CreatedAt;
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization("AuthorOnly");

app.MapDelete("/api/articles/{id}", async (int id, ApplicationDbContext db) =>
{
    var article = await db.Articles.FindAsync(id);
    if (article is null) return Results.NotFound();
    db.Articles.Remove(article);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization("AdminOnly");

app.MapGet("/api/assignments", async (ApplicationDbContext db) =>
    await db.ReviewAssignments.ToListAsync()
).RequireAuthorization("ReviewerOnly");

app.MapPost("/api/assignments/{id}/respond", async (int id, bool accept, ApplicationDbContext db) =>
{
    var assign = await db.ReviewAssignments.FindAsync(id);
    if (assign is null) return Results.NotFound();
    assign.IsAccepted = accept;
    assign.RespondedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(assign);
}).RequireAuthorization("ReviewerOnly");

app.MapPost("/api/reviews", async (Review review, ApplicationDbContext db) =>
{
    db.Reviews.Add(review);
    await db.SaveChangesAsync();
    return Results.Created($"/api/reviews/{review.Id}", review);
}).RequireAuthorization("ReviewerOnly");

app.MapGet("/api/reviews/{id}", async (int id, ApplicationDbContext db) =>
{
    var review = await db.Reviews.FindAsync(id);
    return review is not null ? Results.Ok(review) : Results.NotFound();
}).RequireAuthorization();

app.Run();