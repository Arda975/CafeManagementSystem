using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace AmedimCafeApi.Common;

/// <summary>
/// Single place that converts exceptions to HTTP responses, so controllers don't need
/// try/catch blocks. Unexpected errors are logged and the client only gets a generic
/// message: exception details (SQL, stack traces) never leave the server.
/// </summary>
public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        ProblemDetails problem;

        if (exception is AppException appException)
        {
            problem = new ProblemDetails
            {
                Status = appException.StatusCode,
                Title = appException.StatusCode switch
                {
                    StatusCodes.Status404NotFound => "Kayıt bulunamadı",
                    StatusCodes.Status409Conflict => "İşlem çakışması",
                    _ => "Geçersiz işlem",
                },
                Detail = appException.Message,
            };
        }
        else
        {
            logger.LogError(exception, "Unhandled exception for {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
            problem = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Sunucu hatası",
                Detail = "Beklenmeyen bir hata oluştu.",
            };
        }

        problem.Extensions["traceId"] = System.Diagnostics.Activity.Current?.Id ?? httpContext.TraceIdentifier;

        httpContext.Response.StatusCode = problem.Status!.Value;
        await httpContext.Response.WriteAsJsonAsync(problem, options: null, contentType: "application/problem+json", cancellationToken);
        return true;
    }
}
