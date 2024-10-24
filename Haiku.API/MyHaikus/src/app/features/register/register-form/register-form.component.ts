import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterDto } from '../../../shared/models/registerDto.model';
import { MatchingValidator } from '../../../core/utilities/matching-validator';
import { UsernameValidator } from '../../../core/utilities/username-validator';

/**
 * A component for adding a user through a form.
*/
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  @Output() formSubmit = new EventEmitter<RegisterDto>();
  isSubmitted = false; 

  constructor(private fb: FormBuilder, private usernameValidator: UsernameValidator) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)], [this.usernameValidator.usernameTaken()]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    }, { validators: MatchingValidator.matchingValidator('password', 'confirmPassword') }); 
  }

  /**
   * Submits the form and emits the form data as an `RegisterDto` if the form is valid.
   * @returns {void} This method does not return a value.
  */
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.registerForm.valid) {
      const newRegisterDto: RegisterDto = {
        ...this.registerForm.value
      };
      this.formSubmit.emit(newRegisterDto);
      this.resetForm();
    }
  }

  /**
   * Resets the form and clears the submission state.
   * @returns {void} This method does not return a value. 
  */
  resetForm(): void {
    this.isSubmitted = false;
    this.registerForm.reset();
  }

  /**
   * Checks whether a form control has a specific error or is invalid.
   * 
   * @param {string} controlName - The name of the form control.
   * @param {string} [errorType] - The specific error type to check for.
   * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
  */
  hasError(controlName: string, errorType?: string): boolean {
    const control = this.registerForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }
}
