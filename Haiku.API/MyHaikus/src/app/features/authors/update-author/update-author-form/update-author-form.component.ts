import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorDto } from '../../../../shared/models/authorDto.model';
import { OnInit } from '@angular/core';

/**
 * A component for updating an author through a form.
*/
@Component({
  selector: 'app-update-author-form',
  templateUrl: './update-author-form.component.html',
  styleUrls: ['./update-author-form.component.css']
})
export class UpdateAuthorFormComponent implements OnInit, OnChanges {
  private readonly defaultBio = "No Bio."
  initialFormValues: any = {};

  @Input() authorDto: AuthorDto = { id: 0, name: '', bio: '' };
  @Output() formSubmit = new EventEmitter<AuthorDto>();
  updateAuthorForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.updateAuthorForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      bio: ['', [Validators.minLength(4), Validators.maxLength(300)]]
    });
  }

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(): void {
    this.patchForm();
  }

  /**
 * Stores the initial values of the author update form fields.
 * This method captures the initial name and bio for comparison later.
 * @returns {void} This method does not return a value.
*/
  private storeInitialFormValues(): void {
    this.initialFormValues = {
      name: this.updateAuthorForm.get('name')?.value,
      bio: this.updateAuthorForm.get('bio')?.value,
    };
  }

  /**
   * Checks if changes were made to the author form compared to the initial values.
   * This method compares the current values of the name and bio fields
   * with the initial values stored on form initialization.
   * @returns {boolean} Returns true if changes were made, otherwise false.
  */
  changesMade(): boolean {
    const currentFormValues = {
      name: this.updateAuthorForm.get('name')?.value,
      bio: this.updateAuthorForm.get('bio')?.value,
    };

    return JSON.stringify(this.initialFormValues) !== JSON.stringify(currentFormValues);
  }

  /**
   * Patches the form with the values from the `AuthorDto` object if it exists.
   * This method updates the form controls with the author's original content and stores the initial values.
   * @returns {void} This method does not return a value.
  */
  private patchForm(): void {
    if (this.authorDto) {
      this.updateAuthorForm.patchValue({
        id: this.authorDto.id,
        name: this.authorDto.name,
        bio: this.authorDto.bio
      });
    }
    this.storeInitialFormValues();
  }

  /**
   * Submits the form and emits the form data as an `AuthorDto` if the form is valid.
   * If the title is not provided, it defaults to 'Untitled'.
   * Verifies that changes were made.
   * @returns {void} This method does not return a value.
  */
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.updateAuthorForm.valid && this.changesMade()) {
      const authorDto: AuthorDto = {
        ...this.updateAuthorForm.value,
        bio: this.updateAuthorForm.value.bio || this.defaultBio
      };

      this.formSubmit.emit(authorDto);
      this.resetForm();
    }
  }

  /**
   * Resets the form and clears the submission state.
   * @returns {void} This method does not return a value.
  */
  resetForm(): void {
    this.isSubmitted = false;
    this.updateAuthorForm.reset();
  }

  /**
   * Checks whether a form control has a specific error or is invalid.
   * 
   * @param {string} controlName - The name of the form control.
   * @param {string} [errorType] - The specific error type to check for.
   * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
  */
  hasError(controlName: string, errorType?: string): boolean {
    const control = this.updateAuthorForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }
}
