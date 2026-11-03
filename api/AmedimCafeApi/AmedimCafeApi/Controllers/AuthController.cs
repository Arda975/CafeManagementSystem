using AmedimCafeApi.Common;
using AmedimCafeApi.Dtos;
using AmedimCafeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AmedimCafeApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>Checks the credentials and returns a signed JWT.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimitPolicies.Login)]
    [ProducesResponseType<LoginResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken ct)
    {
        var response = await authService.LoginAsync(request, ct);

        // Same message for "unknown user" and "wrong password": don't reveal which one it was.
        return response is null
            ? Problem(statusCode: StatusCodes.Status401Unauthorized, title: "Giriş başarısız", detail: "Kullanıcı adı veya şifre hatalı.")
            : Ok(response);
    }
}
