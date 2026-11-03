using System.ComponentModel.DataAnnotations;

namespace AmedimCafeApi.Dtos;

public class LoginRequest
{
    [Required, MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Password { get; set; } = string.Empty;
}

public record LoginResponse(string Token, DateTime ExpiresAt, string Username, string Role);
