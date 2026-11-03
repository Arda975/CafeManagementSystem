using AmedimCafeApi.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AmedimCafeApi.Data;

/// <summary>
/// Runs at startup: optionally applies pending migrations, then creates the first admin
/// account if the Users table is empty. The admin password comes from configuration
/// (user secrets / environment variables), never from source code.
/// </summary>
public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services, bool applyMigrations)
    {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<CafeDbContext>();
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger(nameof(DbInitializer));

        if (applyMigrations)
            await db.Database.MigrateAsync();

        if (await db.Users.AnyAsync())
            return;

        var username = config["SeedAdmin:Username"] ?? "admin";
        var password = config["SeedAdmin:Password"];
        if (string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning(
                "No users exist and SeedAdmin:Password is not set, so nobody can log in. " +
                "Run: dotnet user-secrets set \"SeedAdmin:Password\" \"<password>\" and restart.");
            return;
        }

        var admin = new User { Username = username, Role = UserRole.Admin };
        admin.PasswordHash = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>().HashPassword(admin, password);
        db.Users.Add(admin);
        await db.SaveChangesAsync();

        logger.LogInformation("Created initial admin user '{Username}'.", username);
    }
}
