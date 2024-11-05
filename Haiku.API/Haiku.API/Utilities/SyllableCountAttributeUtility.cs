using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Haiku.API.Utilities
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class SyllableCountAttributeUtility : ValidationAttribute
    {
        private readonly int _expectedCount;

        /// <summary>
        /// Initializes a new instance of the <see cref="SyllableCountAttributeUtility"/> class.
        /// </summary>
        /// <param name="expectedCount">The expected number of syllables for validation purposes.</param>
        public SyllableCountAttributeUtility(int expectedCount)
        {
            _expectedCount = expectedCount;
        }

        protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
        {
            if (value is string line)
            {
                int syllableCount = BasicCountSyllables(line);
                if (syllableCount != _expectedCount)
                    return new ValidationResult(ErrorMessage);

            }
            return ValidationResult.Success;
        }

        /// <summary>
        /// Counts the total number of syllables in the given line of text.
        /// </summary>
        /// <param name="line">The line of text to analyze. If <see langword="null"/> or empty, returns 0.</param>
        /// <returns>The total number of syllables found in the <paramref name="line"/>.</returns>
        public static int BasicCountSyllables(string line)
        {
            if (string.IsNullOrWhiteSpace(line))
                return 0;

            line = line.ToLower();
            string[] words = line.Split(new[] { ' ', '\t', '\n', '\r', '.', ',', '!', '?' }, StringSplitOptions.RemoveEmptyEntries);
            int totalSyllables = 0;

            foreach (string word in words)
                totalSyllables += BasicCountSyllablesInWord(word);


            return totalSyllables;
        }

        /// <summary>
        /// Counts the number of syllables in a given word.
        /// </summary>
        /// <param name="word">The word to analyze. If <see langword="null"/> or empty, returns 0.</param>
        /// <returns>The number of syllables found in the <paramref name="word"/>.</returns>
        private static int BasicCountSyllablesInWord(string word)
        {
            if (string.IsNullOrWhiteSpace(word))
                return 0;

            word = word.ToLower();

            if (word.Length == 1)
                return 1;

            if (word.EndsWith("e") && !Regex.IsMatch(word, @"(le|ue)$"))
                word = word.Substring(0, word.Length - 1);

            Regex vowelGroups = new Regex("[aeiouy]+", RegexOptions.IgnoreCase);
            var matches = vowelGroups.Matches(word);

            int syllableCount = matches.Count;

            if (word.EndsWith("le") && word.Length > 2 && !Regex.IsMatch(word, "[aeiou]le$"))
                syllableCount++;

            return Math.Max(1, syllableCount);
        }
    }
}
