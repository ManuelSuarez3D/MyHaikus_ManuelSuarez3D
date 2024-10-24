namespace Haiku.API.Exceptions
{
    public class NotRetrievedException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="NotRetrievedException"/> class with a specified error message.
        /// </summary>
        /// <param name="message">The message that describes the error.</param>
        public NotRetrievedException(string message) : base(message) { }
    }
}
