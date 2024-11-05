using System.ComponentModel.DataAnnotations;

namespace Haiku.API.Utilities
{
    public class StringLengthIfNotEmptyAttributeUtility : ValidationAttribute
    {
        private readonly int _maxLength;

        /// <summary>
        /// Initializes a new instance of the <see cref="MinLengthIfNotEmptyAttributeUtility"/> class.
        /// This attribute enforces a maximum length for a string property, only if the property is not empty.
        /// </summary>
        /// <param name="maxLength">The maximum required length for the string property. Must be a non-negative value.</param>
        /// <param name="field">The name of the field being validated. This will be used in the error message.</param>
        public StringLengthIfNotEmptyAttributeUtility(int maxLength, string field)
        {
            _maxLength = maxLength;
            ErrorMessage = $"{field} length can't be more than {maxLength} characters.";
        }

        protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
        {
            var stringValue = value as string;

            if (string.IsNullOrEmpty(stringValue))
                return ValidationResult.Success;

            if (stringValue.Length > _maxLength)
                return new ValidationResult(ErrorMessage);


            return ValidationResult.Success;
        }
    }
}
