import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * A custom validator for matching two form controls.
*/
export class MatchingValidator {

  /**
   * Creates a validator function that checks if two specified form controls have matching values.
   * 
   * @param {string} controlName - The name of the control to validate.
   * @param {string} matchingControlName - The name of the control to match against.
   * @returns {ValidatorFn} A validator function that can be used with a FormGroup.
  */
  static matchingValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (control && matchingControl) {
        if (matchingControl.errors && !matchingControl.errors['match']) {
          return null;
        }
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ match: true });
          return { match: true };
        } else {
          matchingControl.setErrors(null);
          return null;
        }
      }
      return null;
    };
  }
}
