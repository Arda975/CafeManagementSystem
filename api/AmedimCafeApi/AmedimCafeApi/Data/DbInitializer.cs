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

        var username = config["SeedAdmin:Username"] ?? "admin";
        var password = config["SeedAdmin:Password"];
        var resetRequested = config.GetValue("SeedAdmin:ResetPassword", false);
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

        // Forgotten-password recovery. Deliberately config-only (no HTTP endpoint): only someone
        // with access to the server's user secrets / environment can trigger it.
        if (resetRequested)
        {
            await ResetAdminPasswordAsync(db, hasher, logger, username, password);
            return;
        }

        if (await db.Users.AnyAsync())
            return;

        if (string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning(
                "No users exist and SeedAdmin:Password is not set, so nobody can log in. " +
                "Run: dotnet user-secrets set \"SeedAdmin:Password\" \"<password>\" and restart.");
            return;
        }

        var admin = new User { Username = username, Role = UserRole.Admin };
        admin.PasswordHash = hasher.HashPassword(admin, password);
        db.Users.Add(admin);
        await db.SaveChangesAsync();

        logger.LogInformation("Created initial admin user '{Username}'.", username);
    }

    private static async Task ResetAdminPasswordAsync(
        CafeDbContext db, IPasswordHasher<User> hasher, ILogger logger, string username, string? password)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
        {
            logger.LogError(
                "SeedAdmin:ResetPassword is true but SeedAdmin:Password is missing or shorter than 6 characters; " +
                "admin password was NOT reset.");
            return;
        }

        var user = await db.Users.SingleOrDefaultAsync(u => u.Username == username);
        if (user is null)
        {
            user = new User { Username = username, Role = UserRole.Admin };
            db.Users.Add(user);
        }

        user.Role = UserRole.Admin;
        user.PasswordHash = hasher.HashPassword(user, password);
        await db.SaveChangesAsync();

        logger.LogWarning(
            "Password for admin user '{Username}' was reset from SeedAdmin:Password. " +
            "Now turn the reset off: dotnet user-secrets remove \"SeedAdmin:ResetPassword\"", username);
    }
}
