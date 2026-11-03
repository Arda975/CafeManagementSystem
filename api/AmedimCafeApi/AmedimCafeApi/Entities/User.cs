namespace AmedimCafeApi.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Waiter;
}

public enum UserRole
{
    Admin = 0,
    Waiter = 1
}
