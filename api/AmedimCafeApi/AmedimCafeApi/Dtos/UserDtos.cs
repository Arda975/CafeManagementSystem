using System.ComponentModel.DataAnnotations;
using AmedimCafeApi.Entities;

namespace AmedimCafeApi.Dtos;

/// <summary>Never contains the password or its hash.</summary>
public record UserDto(int Id, string Username, string Role);

public class CreateUserRequest
{
    [Required, MinLength(3), MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required, MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır."), MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    [EnumDataType(typeof(UserRole))]
    public UserRole Role { get; set; } = UserRole.Waiter;
}

/// <summary>Password is optional: leave it empty to keep the current one.</summary>
public class UpdateUserRequest
{
    [Required, MinLength(3), MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır."), MaxLength(100)]
    public string? Password { get; set; }

    [EnumDataType(typeof(UserRole))]
    public UserRole Role { get; set; }
}
