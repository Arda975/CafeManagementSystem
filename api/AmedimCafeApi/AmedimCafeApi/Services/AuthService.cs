using AmedimCafeApi.Auth;
using AmedimCafeApi.Data;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AmedimCafeApi.Services;

public interface IAuthService
{
    /// <returns>null when the username or password is wrong.</returns>
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken ct);
}

public class AuthService(
    CafeDbContext db,
    IPasswordHasher<User> passwordHasher,
    ITokenService tokenService,
    ILogger<AuthService> logger) : IAuthService
{
    // Used when the username does not exist, so that "unknown user" and "wrong password"
    // take about the same time and an attacker can't discover valid usernames by timing.
    private static readonly string DummyHash = new PasswordHasher<User>().HashPassword(new User(), "dummy-password");

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken ct)
    {
        var username = request.Username.Trim();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username, ct);

        if (user is null)
        {
            passwordHasher.VerifyHashedPassword(new User(), DummyHash, request.Password);
            logger.LogWarning("Failed login for unknown user {Username}", username);
            return null;
        }

        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            logger.LogWarning("Failed login for user {Username}", username);
            return null;
        }

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            // The hash was made with older settings; upgrade it while we know the password.
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
            await db.SaveChangesAsync(ct);
        }

        var (token, expiresAt) = tokenService.CreateToken(user);
        return new LoginResponse(token, expiresAt, user.Username, user.Role.ToString());
    }
}
