import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorDto } from '../../../../shared/models/authorDto.model';

/**
 * A component for adding an author through a form.
*/
@Component({
  selector: 'app-add-author-form',
  templateUrl: './add-author-form.component.html',
  styleUrls: ['./add-author-form.component.css']
})
export class AddAuthorFormComponent {
  addAuthorForm: FormGroup;
  private readonly defaultBio = "No Bio."

  @Output() formSubmit = new EventEmitter<AuthorDto>();
  isSubmitted = false; 

  constructor(private fb: FormBuilder) {
    this.addAuthorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      bio: ['', [Validators.minLength(4), Validators.maxLength(300)]]
    });
  }

  /**
   * Submits the form and emits the form data as an `AuthorDto` if the form is valid.
   * If the bio is not provided, it defaults to 'No Bio'.
   * @returns {void} This method does not return a value.
  */
  onSubmit() {
    this.isSubmitted = true;

    if (this.addAuthorForm.valid) {
      const authorDto: AuthorDto = {
        ...this.addAuthorForm.value,
        bio: this.addAuthorForm.value.bio || this.defaultBio,
      };

      this.formSubmit.emit(authorDto);
      this.resetForm();
    }
  }

  /**
   * Resets the form and clears the submission state.
   * 
   * @throws Will call `handleError` with an error message on failure.
  */
  resetForm(): void {
    this.isSubmitted = false;
    this.addAuthorForm.reset();
  }

  /**
 * Checks whether a form control has a specific error or is invalid.
 * 
 * @param {string} controlName - The name of the form control.
 * @param {string} [errorType] - The specific error type to check for.
 * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
*/
  hasError(controlName: string, errorType?: string): boolean {
    const control = this.addAuthorForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }
}
