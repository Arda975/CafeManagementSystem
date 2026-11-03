namespace AmedimCafeApi.Auth;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "AmedimCafeApi";
    public string Audience { get; set; } = "AmedimCafeClient";

    /// <summary>
    /// HMAC-SHA256 signing key, at least 32 bytes. Never commit it: set it with
    /// `dotnet user-secrets set "Jwt:Key" "..."` locally or the Jwt__Key environment variable.
    /// </summary>
    public string Key { get; set; } = string.Empty;

    public int ExpiryMinutes { get; set; } = 120;
}
