namespace AmedimCafeApi.Common;

public static class RateLimitPolicies
{
    /// <summary>5 login attempts per minute per IP address.</summary>
    public const string Login = "login";

    /// <summary>20 orders per minute per IP address on the public order endpoint.</summary>
    public const string PublicOrders = "public-orders";
}
