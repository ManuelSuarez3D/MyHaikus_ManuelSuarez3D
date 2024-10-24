import { Component, Output, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchingValidator } from '../../../../core/utilities/matching-validator';
import { UsernameValidator } from '../../../../core/utilities/username-validator';
import { ProfileDto } from '../../../../shared/models/profileDto.model';
import { UserUpdateDto } from '../../../../shared/models/userUpdateDto.model';
import { debounceTime } from 'rxjs';

/**
 * A component for updating a user profile through a form.
*/
@Component({
  selector: 'app-update-profile-form',
  templateUrl: './update-profile-form.component.html',
  styleUrls: ['./update-profile-form.component.css']
})
export class UpdateProfileFormComponent implements OnInit, OnChanges {
  @Input() userUpdateDto: UserUpdateDto = { id: 0, username: '', password: '', confirmPassword: '' };
  @Input() profileDto: ProfileDto = { id: 0, bio: '', userId: 0, imageId: 0};
  @Output() formUserSubmit = new EventEmitter<UserUpdateDto>();
  @Output() formProfileSubmit = new EventEmitter<ProfileDto>();

  initialUserFormValues: any = {};
  initialProfileFormValues: any = {};

  currentUsername = '';
  updateUserForm: FormGroup;
  updateProfileForm: FormGroup;
  isUsernameChanged = false;
  isUserSubmitted = false;
  isProfileSubmitted = false;

  constructor(private fb: FormBuilder, private usernameValidator: UsernameValidator) {
    this.updateUserForm = this.fb.group({
      id: [null],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)], [this.usernameValidator.usernameTaken()]],
      password: ['', [Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.minLength(8), Validators.maxLength(20)]]
    }, { validators: MatchingValidator.matchingValidator('password', 'confirmPassword') }); 
    this.updateProfileForm = this.fb.group({
      id: [null],
      bio: ['', [Validators.minLength(4), Validators.maxLength(300)]],
      imageUrl: [null],
      userId: [null]
    });
  }

  ngOnInit(): void {
    this.currentUsername = this.userUpdateDto.username;
    this.patchUserForm();
    this.patchProfileForm();
    this.setupUsernameValidation();
  }

  ngOnChanges(): void {
    this.patchUserForm();
    this.patchProfileForm();
    this.setUsernameChange();
  }

  /**
   * Stores the initial values of the user update form fields.
   * This method captures the initial username and password for comparison later.
   * @returns {void} This method does not return a value.
  */
  private storeInitialUserFormValues(): void {
    this.initialUserFormValues = {
      username: this.updateUserForm.get('username')?.value,
      password: this.updateUserForm.get('password')?.value,
    };
  }

  /**
   * Stores the initial values of the profile update form fields.
   * This method captures the initial bio for comparison later.
   * @returns {void} This method does not return a value.
  */
  private storeInitialProfileFormValues(): void {
    this.initialProfileFormValues = {
      bio: this.updateProfileForm.get('bio')?.value,
    };
  }

  /**
   * Checks if changes were made to the user form compared to the initial values.
   * This method compares the current values of the username and password fields
   * with the initial values stored on form initialization.
   * @returns {boolean} Returns true if changes were made, otherwise false.
  */
  userChangesMade(): boolean {
    const currentUserFormValues = {
      username: this.updateUserForm.get('username')?.value,
      password: this.updateUserForm.get('password')?.value,
    };

    return JSON.stringify(this.initialUserFormValues) !== JSON.stringify(currentUserFormValues);
  }

  /**
  * Checks if changes were made to the profile form compared to the initial values.
  * This method compares the current values of the bio fields
  * with the initial values stored on form initialization.
  * @returns {boolean} Returns true if changes were made, otherwise false.
  */
  profileChangesMade(): boolean {
    const currentProfileFormValues = {
      bio: this.updateProfileForm.get('bio')?.value,
    };

    return JSON.stringify(this.initialProfileFormValues) !== JSON.stringify(currentProfileFormValues);
  }

  /**
   * Sets up validation for the username field to check if it has changed from its
   * initial value in lowercase. The method debounces input to reduce validation calls.
   * @returns {void} This method does not return a value.
  */
  private setupUsernameValidation(): void {
    this.updateUserForm.get('username')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        const currentUsernameLower = this.currentUsername.toLowerCase();
        const updatedUsernameLower = this.updateUserForm.get('username')?.value.toLowerCase();

        this.isUsernameChanged = updatedUsernameLower !== currentUsernameLower;

        if (updatedUsernameLower === currentUsernameLower) {
          this.updateUserForm.get('username')?.setErrors(null);
        }
      });
  }

  /**
   * Checks if the patched username is the same as the current username
   * and sets the `isUsernameChanged` flag accordingly.
   * @returns {void} This method does not return a value.
  */
  private setUsernameChange(): void {
    const patchedUsername = this.updateUserForm.get('username')?.value;
    if (patchedUsername === this.currentUsername) {
      this.isUsernameChanged = false;
    } else {
      this.isUsernameChanged = true;
    }
  }

  /**
   * Patches the form with the values from the `UserUpdateDto` object if it exists.
   * This method updates the form controls with the user's username and stores the initial values.
   * @returns {void} This method does not return a value.
  */
  private patchUserForm(): void {
    if (this.userUpdateDto) {
      this.updateUserForm.patchValue({
        username: this.userUpdateDto.username,
      });
    }
    this.storeInitialUserFormValues();
  }

  /**
 * Patches the form with the values from the `ProfileDto` object if it exists.
 * This method updates the form controls with the profile's original content and stores the initial values.
 * @returns {void} This method does not return a value.
*/
  private patchProfileForm(): void {
    if (this.profileDto) {
      this.updateProfileForm.patchValue({
        bio: this.profileDto.bio,
      });
    }
    this.storeInitialProfileFormValues();
  }

  /**
 * Submits the form and emits the form data as an `UserUpdateDto` if the form is valid.
 * Verifies that changes were made.
 * @returns {void} This method does not return a value.
*/
  onUserSubmit(): void {
    this.isUserSubmitted = true;

    if (this.updateUserForm.valid && this.userChangesMade()) {
      const userUpdatedDto: UserUpdateDto = { ...this.updateUserForm.value };

      this.formUserSubmit.emit(userUpdatedDto);
      this.resetForm();
    }
  }

  /**
   * Submits the form and emits the form data as an `ProfileDto` if the form is valid.
   * If the bio is not provided, it defaults to 'No Bio'.
   * Verifies that changes were made.
   * @returns {void} This method does not return a value.
  */
  onProfileSubmit(): void {
    this.isProfileSubmitted = true;

    if (this.updateProfileForm.valid && this.profileChangesMade()) {
      const profileUpdatedDto: ProfileDto = {
        ...this.updateUserForm.value,
        bio: this.updateProfileForm.value.bio || 'No Bio'
      };

      this.formProfileSubmit.emit(profileUpdatedDto);
      this.resetForm();
    }
  }

  /**
   * Resets the form and clears the submission state.
   * @returns {void} This method does not return a value.
  */
  resetForm(): void {
    this.isUserSubmitted = false;
    this.isProfileSubmitted = false;
    this.updateUserForm.reset();
    this.updateProfileForm.reset();
  }

  /**
   * Checks whether the User form control has a specific error or is invalid.
   * 
   * @param {string} controlName - The name of the form control.
   * @param {string} [errorType] - The specific error type to check for.
   * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
  */
  hasUserError(controlName: string, errorType?: string): boolean {
    const control = this.updateUserForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isUserSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }

  /**
   * Checks whether the Profile form control has a specific error or is invalid.
   * 
   * @param {string} controlName - The name of the form control.
   * @param {string} [errorType] - The specific error type to check for.
   * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
  */
  hasProfileError(controlName: string, errorType?: string): boolean {
    const control = this.updateProfileForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isProfileSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }
}
