import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * A utility class for validating syllable counts in lines of text and words.
*/
export class SyllableValidator {

  /**
   * Counts the number of syllables in a given line of text.
   * 
   * @param {string} line - The line of text for which to count the syllables.
   * @returns {number} The total number of syllables in the line.
  */
  static countSyllables(line: string): number {
    if (!line) return 0;

    line = line.toLowerCase().replace(/[.,!?]/g, '');

    const words = line.split(/\s+/);
    let syllableCount = 0;

    words.forEach(word => {
      syllableCount += SyllableValidator.countSyllablesInWord(word);
    });

    return syllableCount;
  }

  /**
   * Counts the number of syllables in a given word.
   * 
   * @param {string} word - The word for which to count the syllables.
   * @returns {number} The number of syllables in the word.
  */
  static countSyllablesInWord(word: string): number {
    if (!word) return 0;

    word = word.toLowerCase();

    if (word.endsWith('e') && !/le$/.test(word)) {
      word = word.slice(0, -1);
    }

    const matches = word.match(/[aeiouy]+/g);
    let count = matches ? matches.length : 0;

    if (word.endsWith('le') && word.length > 2 && !/[aeiou]le$/.test(word)) {
      count++;
    }

    return Math.max(1, count);
  }

  /**
   * Creates a validator function to check if the number of syllables in a form control's value matches the expected count.
   * 
   * @param {number} expectedCount - The expected syllable count.
   * @returns {(control: AbstractControl) => ValidationErrors | null} A validation function that returns null if the syllable count matches the expected count; otherwise, it returns an object with validation error details.
  */
  static syllableCountValidator(expectedCount: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const syllables = SyllableValidator.countSyllables(value);
      return syllables === expectedCount ? null : { syllablecountvalidator: { required: expectedCount, actual: syllables } };
    };
  }
}
