namespace Haiku.API.Exceptions
{
    public class UsernameAlreadyTakenException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="UsernameAlreadyTakenException"/> class with a specified error message.
        /// </summary>
        /// <param name="message">The message that describes the error.</param>
        public UsernameAlreadyTakenException(string message) : base(message) { }
    }
}
