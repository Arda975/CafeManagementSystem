using AmedimCafeApi.Common;
using AmedimCafeApi.Data;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AmedimCafeApi.Services;

public interface IUserService
{
    Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken ct);
    Task<UserDto> CreateAsync(CreateUserRequest request, CancellationToken ct);
    Task<UserDto> UpdateAsync(int id, UpdateUserRequest request, int currentUserId, CancellationToken ct);
    Task DeleteAsync(int id, int currentUserId, CancellationToken ct);
}

public class UserService(CafeDbContext db, IPasswordHasher<User> passwordHasher) : IUserService
{
    public async Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken ct)
    {
        var users = await db.Users.AsNoTracking().OrderBy(u => u.Id).ToListAsync(ct);
        return users.Select(ToDto).ToList();
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request, CancellationToken ct)
    {
        var username = request.Username.Trim();
        await EnsureUsernameIsFreeAsync(username, exceptUserId: null, ct);

        var user = new User { Username = username, Role = request.Role };
        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync(ct);
        return ToDto(user);
    }

    public async Task<UserDto> UpdateAsync(int id, UpdateUserRequest request, int currentUserId, CancellationToken ct)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id, ct)
            ?? throw new NotFoundException($"Kullanıcı bulunamadı (id: {id}).");

        var username = request.Username.Trim();
        if (username != user.Username)
            await EnsureUsernameIsFreeAsync(username, exceptUserId: id, ct);

        if (user.Role == UserRole.Admin && request.Role != UserRole.Admin)
        {
            if (id == currentUserId)
                throw new BusinessRuleException("Kendi admin yetkinizi kaldıramazsınız.");
            await EnsureAnotherAdminExistsAsync(id, ct);
        }

        user.Username = username;
        user.Role = request.Role;
        if (!string.IsNullOrEmpty(request.Password))
            user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        await db.SaveChangesAsync(ct);
        return ToDto(user);
    }

    public async Task DeleteAsync(int id, int currentUserId, CancellationToken ct)
    {
        if (id == currentUserId)
            throw new BusinessRuleException("Kendi hesabınızı silemezsiniz.");

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id, ct)
            ?? throw new NotFoundException($"Kullanıcı bulunamadı (id: {id}).");

        if (user.Role == UserRole.Admin)
            await EnsureAnotherAdminExistsAsync(id, ct);

        db.Users.Remove(user);
        await db.SaveChangesAsync(ct);
    }

    private async Task EnsureUsernameIsFreeAsync(string username, int? exceptUserId, CancellationToken ct)
    {
        if (await db.Users.AnyAsync(u => u.Username == username && u.Id != exceptUserId, ct))
            throw new ConflictException($"'{username}' kullanıcı adı zaten kullanılıyor.");
    }

    private async Task EnsureAnotherAdminExistsAsync(int userId, CancellationToken ct)
    {
        if (!await db.Users.AnyAsync(u => u.Role == UserRole.Admin && u.Id != userId, ct))
            throw new BusinessRuleException("Sistemde en az bir admin kalmalıdır.");
    }

    private static UserDto ToDto(User user) => new(user.Id, user.Username, user.Role.ToString());
}
