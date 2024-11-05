using System.ComponentModel.DataAnnotations;

namespace Haiku.API.Utilities
{
    public class MinLengthIfNotEmptyAttributeUtility : ValidationAttribute
    {
        private readonly int _minLength;

        /// <summary>
        /// Initializes a new instance of the <see cref="MinLengthIfNotEmptyAttributeUtility"/> class.
        /// This attribute enforces a minimum length for a string property, only if the property is not empty.
        /// </summary>
        /// <param name="minLength">The minimum required length for the string property. Must be a non-negative value.</param>
        /// <param name="field">The name of the field being validated. This will be used in the error message.</param>
        public MinLengthIfNotEmptyAttributeUtility(int minLength, string field)
        {
            _minLength = minLength;
            ErrorMessage = $"{field} length must be at least {minLength} characters.";
        }

        protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
        {
            var stringValue = value as string;

            if (string.IsNullOrEmpty(stringValue))
                return ValidationResult.Success;

            if (stringValue.Length < _minLength)
                return new ValidationResult(ErrorMessage);


            return ValidationResult.Success;
        }
    }
}
