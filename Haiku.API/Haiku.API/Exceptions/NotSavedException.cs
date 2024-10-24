namespace Haiku.API.Exceptions
{
    public class NotSavedException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NotSavedException"/> class with a specified error message.
        /// </summary>
        /// <param name="message">The message that describes the error.</param>
        public NotSavedException(string message) : base(message) { }
    }
}
