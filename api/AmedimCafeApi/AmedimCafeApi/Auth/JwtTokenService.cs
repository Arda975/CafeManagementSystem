using System.Security.Claims;
using System.Text;
using AmedimCafeApi.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace AmedimCafeApi.Auth;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) CreateToken(User user);
}

public class JwtTokenService(IOptions<JwtOptions> options) : ITokenService
{
    private readonly JwtOptions _options = options.Value;

    public (string Token, DateTime ExpiresAt) CreateToken(User user)
    {
        var now = DateTime.UtcNow;
        var expiresAt = now.AddMinutes(_options.ExpiryMinutes);

        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = _options.Issuer,
            Audience = _options.Audience,
            IssuedAt = now,
            NotBefore = now,
            Expires = expiresAt,
            Subject = new ClaimsIdentity(
            [
                new Claim(ClaimNames.Subject, user.Id.ToString()),
                new Claim(ClaimNames.Username, user.Username),
                new Claim(ClaimNames.Role, user.Role.ToString()),
                new Claim(ClaimNames.TokenId, Guid.NewGuid().ToString()),
            ]),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key)),
                SecurityAlgorithms.HmacSha256),
        };

        return (new JsonWebTokenHandler().CreateToken(descriptor), expiresAt);
    }
}
