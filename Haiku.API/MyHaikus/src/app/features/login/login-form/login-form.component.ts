import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginDto } from '../../../shared/models/loginDto.model';

/**
 * A component for login a user in through a form.
*/
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  @Output() formSubmit = new EventEmitter<LoginDto>();
  isSubmitted = false; 

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
    });
  }

  /**
   * Submits the form and emits the form data as a `LoginDto` if the form is valid.
   * @returns {void} This method does not return a value.
  */
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.loginForm.valid) {
      const loginDto: LoginDto = {
        ...this.loginForm.value
      };

      this.formSubmit.emit(loginDto);
      this.resetForm();
    }
  }

  /**
   * Resets the form and clears the submission state.
   * @returns {void} This method does not return a value.
  */
  resetForm(): void {
    this.isSubmitted = false;
    this.loginForm.reset();
  }

  /**
   * Checks whether a form control has a specific error or is invalid.
   * 
   * @param {string} controlName - The name of the form control.
   * @param {string} [errorType] - The specific error type to check for.
   * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
  */
  hasError(controlName: string, errorType?: string): boolean {
    const control = this.loginForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }
}
