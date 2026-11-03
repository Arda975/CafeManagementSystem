namespace AmedimCafeApi.Common;

/// <summary>
/// Expected business errors. GlobalExceptionHandler turns them into ProblemDetails
/// responses with the given status code; their message is safe to show to the client.
/// </summary>
public abstract class AppException(string message, int statusCode) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}

public class NotFoundException(string message) : AppException(message, StatusCodes.Status404NotFound);

public class ConflictException(string message) : AppException(message, StatusCodes.Status409Conflict);

public class BusinessRuleException(string message) : AppException(message, StatusCodes.Status400BadRequest);
