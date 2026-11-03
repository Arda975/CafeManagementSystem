namespace AmedimCafeApi.Auth;

/// <summary>
/// Short JWT claim names. JwtBearer is configured with MapInboundClaims = false,
/// so these names arrive in HttpContext.User unchanged.
/// </summary>
public static class ClaimNames
{
    public const string Subject = "sub";
    public const string Username = "unique_name";
    public const string Role = "role";
    public const string TokenId = "jti";
}
