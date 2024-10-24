import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, OnChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subject, BehaviorSubject } from "rxjs";
import { UserService } from "../../../../core/services/user.service";
import { SyllableValidator } from "../../../../core/utilities/syllable-validator";
import { UserHaikuDto } from "../../../../shared/models/userHaikuDto.model";

/**
 * A component for updating a user haiku through a form.
*/
@Component({
  selector: 'app-update-user-haiku-form',
  templateUrl: './update-user-haiku-form.component.html',
  styleUrls: ['./update-user-haiku-form.component.css']
})
export class UpdateUserHaikuFormComponent implements OnInit, OnChanges {
  updateUserHaikuForm: FormGroup;
  private readonly defaultTitle = "Untitled";
  initialFormValues: any = {};

  @Input() userHaikuDto: UserHaikuDto = { id: 0, title: '', lineOne: '', lineTwo: '', lineThree: '', userId: 0 };
  @Output() formSubmit = new EventEmitter<UserHaikuDto>();

  isSubmitted = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.updateUserHaikuForm = this.fb.group({
      id: [null],
      username: [''],
      title: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      lineOne: ['', [Validators.required, SyllableValidator.syllableCountValidator(5)]],
      lineTwo: ['', [Validators.required, SyllableValidator.syllableCountValidator(7)]],
      lineThree: ['', [Validators.required, SyllableValidator.syllableCountValidator(5)]],
      userId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(): void {
    this.patchForm();
  }

  /**
   * Stores the initial values of the user haiku update form fields.
   * This method captures the initial title and lines for comparison later.
   * @returns {void} This method does not return a value.
  */
  private storeInitialFormValues(): void {
    this.initialFormValues = {
      title: this.updateUserHaikuForm.get('title')?.value,
      lineOne: this.updateUserHaikuForm.get('lineOne')?.value,
      lineTwo: this.updateUserHaikuForm.get('lineTwo')?.value,
      lineThree: this.updateUserHaikuForm.get('lineThree')?.value,
    };
  }

  /**
 * Checks if changes were made to the user haiku form compared to the initial values.
 * This method compares the current values of the title and lines fields
 * with the initial values stored on form initialization.
 * @returns {boolean} Returns true if changes were made, otherwise false.
*/
  changesMade(): boolean {
    const currentFormValues = {
      title: this.updateUserHaikuForm.get('title')?.value,
      lineOne: this.updateUserHaikuForm.get('lineOne')?.value,
      lineTwo: this.updateUserHaikuForm.get('lineTwo')?.value,
      lineThree: this.updateUserHaikuForm.get('lineThree')?.value,
    };

    return JSON.stringify(this.initialFormValues) !== JSON.stringify(currentFormValues);
  }

  /**
   * Patches the form with the values from the `UserHaikuDto` object if it exists.
   * This method updates the form controls with the author's original content and stores the initial values.
   * @returns {void} This method does not return a value.
  */
  private patchForm(): void {
    if (this.userHaikuDto) {
      this.updateUserHaikuForm.patchValue({ ...this.userHaikuDto });
    }
    this.storeInitialFormValues();
  }

  /**
   * Submits the form and emits the form data as an `UserHaikuDto` if the form is valid.
   * If the title is not provided, it defaults to 'Untitled'.
   * @returns {void} This method does not return a value.
  */
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.updateUserHaikuForm.valid && this.changesMade()) {
      const updatedUserHaikuDto: UserHaikuDto = {
        ...this.updateUserHaikuForm.value,
        title: this.updateUserHaikuForm.value.title || this.defaultTitle
      };
      this.formSubmit.emit(updatedUserHaikuDto);
      this.resetForm();
    }
  }

  /**
   * Resets the form and clears the submission state.
   * @returns {void} This method does not return a value.
  */
  resetForm(): void {
    this.isSubmitted = false;
    this.updateUserHaikuForm.reset();
  }

  /**
   * Checks whether a form control has a specific error or is invalid.
   * 
   * @param {string} controlName - The name of the form control.
   * @param {string} [errorType] - The specific error type to check for.
   * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
  */
  hasError(controlName: string, errorType?: string): boolean {
    const control = this.updateUserHaikuForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }
}
