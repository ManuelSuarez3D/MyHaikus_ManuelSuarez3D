using Haiku.API.Exceptions;
using Haiku.API.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Net;

public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// <summary>
    /// Invokes the middleware to handle exceptions during the request processing.
    /// </summary>
    /// <param name="context">The <see cref="HttpContext"/> for the current request.</param>
    /// <returns>A task that represents the asynchronous exception handling operation.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); // Call the next middleware in the pipeline
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    /// <summary>
    /// Handles the exception by returning an appropriate XML response based on the exception type.
    /// </summary>
    /// <param name="context">The <see cref="HttpContext"/> for the current request.</param>
    /// <param name="ex">The exception that occurred during the request.</param>
    /// <returns>A task that represents the asynchronous exception handling operation.</returns>
    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/xml";

        switch (ex)
        {
            case NotFoundException nfEx:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = nfEx.Message
                });
                break;

            case ArgumentException aEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = aEx.Message
                });
                break;

            case UnauthorizedAccessException uaEx:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = uaEx.Message
                });
                break;

            case NotSavedException nsEx:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = nsEx.Message
                });
                break;

            case NotRetrievedException nrEx:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = nrEx.Message
                });
                break;

            case SqlException:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "An error occurred related to the database."
                });
                break;

            case DbUpdateException:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "An error occurred saving changes into the database."
                });
                break;

            case UsernameAlreadyTakenException uaEx:
                context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = uaEx.Message
                });
                break;

            case InvalidOperationException ioEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = ioEx.Message
                });
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await WriteResponseAsync(context, new ErrorDetails
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "An unexpected error occurred."
                });
                break;
        }

        _logger.LogError(ex, "An error occurred: {errorMessage}", ex.Message);
    }

    /// <summary>
    /// Writes the error response in XML format.
    /// </summary>
    /// <param name="context">The <see cref="HttpContext"/> for the current request.</param>
    /// <param name="errorDetails">The error details to be written to the response.</param>
    /// <returns>A task that represents the asynchronous writing operation.</returns>
    private async Task WriteResponseAsync(HttpContext context, ErrorDetails errorDetails)
    {
        await context.Response.WriteAsync(errorDetails.ToXml());
    }
}
