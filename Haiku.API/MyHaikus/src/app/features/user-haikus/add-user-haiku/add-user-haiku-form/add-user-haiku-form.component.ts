import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { UserService } from '../../../../core/services/user.service';
import { SyllableValidator } from '../../../../core/utilities/syllable-validator';
import { UserHaikuDto } from '../../../../shared/models/userHaikuDto.model';

/**
 * A component for adding a user haiku through a form.
*/
@Component({
  selector: 'app-add-user-haiku-form',
  templateUrl: './add-user-haiku-form.component.html',
  styleUrls: ['./add-user-haiku-form.component.css']
})
export class AddUserHaikuFormComponent implements OnInit {
  addUserHaikuForm: FormGroup;
  private readonly defaultTitle = "Untitled";

  private unsubscribe$ = new Subject<void>();
  @Output() formSubmit = new EventEmitter<UserHaikuDto>();

  isSubmitted: boolean = false;
  currentUserId: number | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthenticationService) {
    this.addUserHaikuForm = this.fb.group({
      title: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      lineOne: ['', [Validators.required, SyllableValidator.syllableCountValidator(5)]],
      lineTwo: ['', [Validators.required, SyllableValidator.syllableCountValidator(7)]],
      lineThree: ['', [Validators.required, SyllableValidator.syllableCountValidator(5)]],
      userId: [null]
    });
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
  }

  /**
   * Submits the form and emits the form data as an `UserHaikuDto` if the form is valid.
   * UserId is set by default.
   * If the title is not provided, it defaults to 'Untitled'.
   * @returns {void} This method does not return a value.
  */
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.addUserHaikuForm.valid && this.currentUserId != null) {
      const newUserHaikuDto: UserHaikuDto = {
        ...this.addUserHaikuForm.value,
        userId: this.currentUserId,
        title: this.addUserHaikuForm.value.title || this.defaultTitle
      };
      this.formSubmit.emit(newUserHaikuDto);
      this.resetForm();
    }
  }

  /**
   * Resets the form and clears the submission state.
   * @returns {void} This method does not return a value.
  */
  resetForm(): void {
    this.isSubmitted = false;
    this.addUserHaikuForm.reset();
  }

  /**
   * Checks whether a form control has a specific error or is invalid.
   * 
   * @param {string} controlName - The name of the form control.
   * @param {string} [errorType] - The specific error type to check for.
   * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
  */
  hasError(controlName: string, errorType?: string): boolean {
    const control = this.addUserHaikuForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }
}
