using AmedimCafeApi.Entities;

namespace AmedimCafeApi.Auth;

/// <summary>Role names as they appear in the JWT "role" claim and in [Authorize(Roles = ...)].</summary>
public static class Roles
{
    public const string Admin = nameof(UserRole.Admin);
    public const string Waiter = nameof(UserRole.Waiter);
    public const string Staff = Admin + "," + Waiter;
}
