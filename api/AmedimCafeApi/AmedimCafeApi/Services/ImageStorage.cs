using AmedimCafeApi.Common;

namespace AmedimCafeApi.Services;

public interface IImageStorage
{
    /// <returns>Relative path to store in the database, e.g. "uploads/3f2a....jpg".</returns>
    Task<string> SaveAsync(IFormFile file, CancellationToken ct);
}

/// <summary>
/// Saves uploaded product images under wwwroot/uploads. The original file name is never
/// used on disk (a GUID is), which rules out path traversal and overwriting other files.
/// </summary>
public class LocalImageStorage(IWebHostEnvironment env) : IImageStorage
{
    private const long MaxBytes = 2 * 1024 * 1024;
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    public async Task<string> SaveAsync(IFormFile file, CancellationToken ct)
    {
        if (file.Length == 0)
            throw new BusinessRuleException("Görsel dosyası boş.");
        if (file.Length > MaxBytes)
            throw new BusinessRuleException("Görsel en fazla 2 MB olabilir.");

        var extension = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(extension))
            throw new BusinessRuleException("Sadece .jpg, .jpeg, .png veya .webp yüklenebilir.");

        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var uploadDir = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadDir);

        var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        await using (var stream = new FileStream(Path.Combine(uploadDir, fileName), FileMode.CreateNew))
        {
            await file.CopyToAsync(stream, ct);
        }

        return $"uploads/{fileName}";
    }
}
