import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Subject, takeUntil } from "rxjs";
import { AuthenticationService } from "../../../core/services/authentication.service";
import { NavigationService } from "../../../core/services/navigation.service";
import { ProfileService } from "../../../core/services/profile.service";
import { UserService } from "../../../core/services/user.service";
import { ProfileDto } from "../../../shared/models/profileDto.model";
import { UserDto } from "../../../shared/models/userDto.model";
import { UserUpdateDto } from "../../../shared/models/userUpdateDto.model";
import { LogoutService } from "../../../core/services/logout.service";

/**
 * A component for updating a user profile.
*/
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  userDto: UserDto = { id: 0, username: '', password: '', roleId: 0 };
  profileDto: ProfileDto = { id: 0, bio: '', userId: 0, imageId: 0 };
  userUpdateDto: UserUpdateDto = { id: 0, username: '', password: '', confirmPassword: '' };
  userId: number | null = null;
  userIdToDelete: number | null = null;

  successMessages = {
    update: ""
  };

  errorMessages: { update: string | null } = {
    update: null,
  };

  loadingStates = {
    update: false,
  };

  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private authService: AuthenticationService,
    private logoutService: LogoutService,
    private navigationService: NavigationService,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.clearMessages();

    this.userId = this.authService.getUserId();

    if (this.userId) {
      this.loadUserAndProfile(this.userId);
    }
  }

  /**
   * Clears any error messages related to add loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      update: null,
    };
    this.successMessages = {
      update: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., update loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'update'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'update'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
    this.successMessages[type] = "";
  }

  /**
 * Loads the specific user by the ID and assigns it to the component's `userUpdateDto`, then directs to `loadProfileByUserId` method.
 * 
 * @param {number} userId - The ID of the profile to load.
 * @returns {void} This method does not return a value.
*/
  loadUserAndProfile(userId: number): void {
    this.loadingStates.update = true;

    this.userService.getUserById(userId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.update = false;
      })
    ).subscribe({
      next: user => {
        this.userUpdateDto.username = user.username;
        this.userUpdateDto.password = user.password;
        this.userDto.id = user.id;
        this.userDto.roleId = user.roleId;
        this.loadProfileByUserId(user.id)
      },
      error: error => this.handleError(error, 'update')
    });
  }

  /**
   * Loads the specific profile by the user ID and assigns it to the component's `profileDto`.
   * 
   * @param {number} userId - The ID of the profile to load.
   * @returns {void} This method does not return a value.
  */
  loadProfileByUserId(userId: number): void {
    this.loadingStates.update = true;

    this.profileService.getProfileByUserId(userId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.update = false;
      })
    ).subscribe({
      next: profile => {
        this.profileDto = profile;
      },
      error: error => this.handleError(error, 'update')
    });
  }

  /**
   * Updates an existing user and the reloads the User then directs to `loadUserAndProfile` method..
   * 
   * @param {UserUpdateDto} updatedUser - The data transfer object containing the updated user details.
   * @returns {void} This method does not return a value.
  */
  updateUser(updatedUser: UserUpdateDto): void {
    this.loadingStates.update = true;

    this.userDto.username = updatedUser.username;
    this.userDto.password = updatedUser.password;

    this.userService.updateUser(this.userDto.id, this.userDto).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.update = false;
      })
    ).subscribe({
      next: () => {
        this.clearMessages();
        this.successMessages.update = "User updated successfully!";
        if (this.userId)
          this.loadUserAndProfile(this.userId);
      },
      error: error => this.handleError(error, 'update')
    });
  }

  /**
   * Updates an existing profile and then reloads the Profile then directs to `loadUserAndProfile` method..
   * 
   * @param {ProfileDto} updatedProfile - The data transfer object containing the updated profile details.
   * @returns {void} This method does not return a value.
  */
  updateProfile(updatedProfile: ProfileDto): void {
    this.loadingStates.update = true;

    this.profileDto.bio = updatedProfile.bio;

    this.profileService.updateProfile(this.profileDto.id, this.profileDto).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.update = false;
      })
    ).subscribe({
      next: () => {
        this.clearMessages();
        this.successMessages.update = "Profile updated successfully!";
        if (this.userId)
          this.loadUserAndProfile(this.userId);
      },
      error: error => this.handleError(error, 'update')
    });
  }

  /**
   * Deletes a user based on the user ID stored in `userIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
  */
  deleteUser(): void {
    if (this.userIdToDelete) {
      this.loadingStates.update = true;
      this.userService.deleteUser(this.userIdToDelete).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loadingStates.update = false)
      ).subscribe({
        next: () =>
        {
          this.logoutService.logout();
          this.viewLogin();
        },
        error: error => this.handleError(error, 'update')
      });
    }
  }

  /**
   * Navigates the user to the login view.
   * 
   * @returns {void} This method does not return a value.
  */
  viewLogin(): void {
    this.navigationService.viewLogin();
  }

  /**
   * Opens a modal for user deletion confirmation by setting the user ID to delete.
   *
   * @returns {void} This method does not return a value.
  */
  openUserModal(): void {
    this.userIdToDelete = this.userId;
  }
}
