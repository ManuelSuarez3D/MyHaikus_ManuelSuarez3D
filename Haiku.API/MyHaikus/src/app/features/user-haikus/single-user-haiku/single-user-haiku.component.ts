import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { NavigationService } from '../../../core/services/navigation.service';
import { ProfileService } from '../../../core/services/profile.service';
import { UserHaikuService } from '../../../core/services/user-haiku.service';
import { UserService } from '../../../core/services/user.service';
import { AccountDto } from '../../../shared/models/accountDto.model';
import { UserHaikuDto } from '../../../shared/models/userHaikuDto.model';
import { ImageService } from '../../../core/services/image.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { AuthorizationService } from '../../../core/services/authorization.service';

/**
 * Component for displaying and managing a user haiku and user.
*/
@Component({
  selector: 'app-single-user-haiku',
  templateUrl: './single-user-haiku.component.html',
  styleUrls: ['./single-user-haiku.component.css']
})
export class SingleUserHaikuComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private readonly adminRole = 1;

  userHaikuDto: UserHaikuDto = { id: 0, title: '', lineOne: '', lineTwo: '', lineThree: '', userId: 0 };
  accountDto: AccountDto = { id: 0, username: '', password: '', bio: '', filePath: '', roleId: 0 };

  currentUserIsAdmin: boolean | null = null;
  currentUserId: number | null = null;
  userHaikuId: number | null = null;
  userHaikuIdToDelete: number | null = null;
  userIdToDelete: number | null = null;
  userToDeleteRoleId: number | null = null;

  errorMessages: { user: string | null, userHaiku: string | null } = {
    user: null,
    userHaiku: null,
  };

  loadingStates = {
    user: false,
    userHaiku: false
  };

  constructor(
    private route: ActivatedRoute,
    private userHaikuService: UserHaikuService,
    private userService: UserService,
    private profileService: ProfileService,
    private imageService: ImageService,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private navigationService: NavigationService,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.user = true;
    this.clearMessages();

    this.userHaikuId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUserId = this.authenticationService.getUserId();
    this.currentUserIsAdmin = this.authorizationService.isAuthorizedForRoles(["Admin"]);

    if (this.userHaikuId)
      this.loadUserHaikuById(this.userHaikuId);
  }

  /**
   * Clears any error messages related to author haikus loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      user: null,
      userHaiku: null,
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., user, user haiku loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'user'} type - The type of operation encountering the error.
   * @param {'userHaiku'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'user' | 'userHaiku'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
  }

  /**
   * Loads user by user ID, proceeds to load user haiku.
   * @param {number} userHaikuId - The ID of the user to load
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadUserHaikuById(userHaikuId: number): void {
    this.loadingStates.userHaiku = true;

    this.userHaikuService.getUserHaikuById(userHaikuId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.userHaiku = false;
      })
    ).subscribe({
      next: userHaiku => {
        this.userHaikuDto = userHaiku;
        this.loadUserAndProfile(userHaiku.userId);
      },
      error: error => this.handleError(error, 'userHaiku')
    });
  }

  /**
   * Loads a user by the user ID.
   * @param {number} userId - The ID of the user to load.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadUserAndProfile(userId: number): void {
    this.loadingStates.user = true;

    this.userService.getUserById(userId).pipe(
      takeUntil(this.unsubscribe$),
      switchMap(user =>
        this.profileService.getProfileByUserId(user.id).pipe(
          takeUntil(this.unsubscribe$),
          switchMap(profile => {
            // Fetch the image by the imageId in the profile
            if (profile?.imageId) {
              return this.imageService.getImageById(profile.imageId).pipe(
                takeUntil(this.unsubscribe$),
                map(image => ({ user, profile, image }))
              );
            } else {
              return of({ user, profile, image: null }); // If no imageId, return null
            }
          }),
          finalize(() => {
            this.loadingStates.user = false;
          })
        )
      )
    )
      .subscribe({
        next: ({ user, profile, image }) => {
          this.accountDto = {
            ...user,
            bio: profile?.bio || 'Empty Bio Error',
            filePath: image?.filePath || 'Empty Image Error', // Assuming filePath contains the image URL
          };
        },
        error: error => this.handleError(error, 'user')
      });
  }

  /**
   * Deletes a user haiku based on the user haiku ID stored in `userHaikuIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteUserHaiku(): void {
    if (this.userHaikuIdToDelete) {
      this.loadingStates.user = true;

      this.userHaikuService.deleteUserHaiku(this.userHaikuIdToDelete).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loadingStates.user = false)
      ).subscribe({
        next: () => {
          this.userHaikuIdToDelete = null;
          this.viewUserHaikus();
        },
        error: error => this.handleError(error, 'userHaiku')
      });
    }
  }

  /**
   * Deletes a user based on the user ID stored in `userToDeleteRoleId`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteUser(): void {
    if (this.userIdToDelete && this.userToDeleteRoleId) {
      if (this.userIsNotAdmin(this.userToDeleteRoleId)) {
        this.loadingStates.user = true;

        this.userService.deleteUser(this.userIdToDelete).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loadingStates.user = false)
        ).subscribe({
          next: () => {
            this.userIdToDelete = null;
            this.userToDeleteRoleId = null;
            this.viewUserHaikus();
          },
          error: error => this.handleError(error, 'user')
        });
      }
    }
  }

  /**
   * Navigates the User view by ID.
   *
   * @param {number} userId - The User ID.
   * @returns {void} This method does not return a value.
  */
  viewUser(userId: number): void {
    this.navigationService.viewUser(userId);
  }

  /**
   * Navigates to all User Haikus.
   *
   * @returns {void} This method does not return a value.
  */
  viewUserHaikus(): void {
    this.navigationService.viewUserHaikus();
  }

  /**
   * Navigates the User Haiku update by ID.
   *
   * @param {number} authorId - The User Haiku  ID.
   * @returns {void} This method does not return a value.
  */
  updateUserHaiku(userHaikuId: number): void {
    this.navigationService.updateUserHaiku(userHaikuId);
  }

  /**
   * Opens a modal for user deletion confirmation by setting the user ID to delete.
   *
   * @param {number} userId - The ID of the user to be deleted.
   * @returns {void} This method does not return a value.
  */
  openUserModal(userId: number, roleId: number): void {
    this.userIdToDelete = userId;
    this.userToDeleteRoleId = roleId;
  }

  /**
   * Opens a modal for user haiku deletion confirmation by setting the user haiku ID to delete.
   *
   * @param {number} userHaikuId - The ID of the user haiku to be deleted.
   * @returns {void} This method does not return a value.
  */
  openUserHaikuModal(userHaikuId: number): void {
    this.userHaikuIdToDelete = userHaikuId;
  }

  /**
   * Checks if the given role ID is not an admin role.
   * 
   * This method compares the provided role ID with the defined admin role ID. 
   * 
   * @param {number} roleId - The role ID to check against the admin role.
   * @returns {boolean} - `true` if the role ID is not an admin role, `false` otherwise.
  */
  userIsNotAdmin(roleId: number): boolean {
    if (roleId != this.adminRole)
      return true

    return false;
  }

  /**
   * Checks if the given owner ID is not the current user.
   * 
   * This method compares the provided owner ID with the fetched user ID. 
   * 
   * @param {number} roleId - The owner ID to check against the user ID.
   * @returns {boolean} - `true` if the owner ID does not belong to the user, `false` otherwise.
  */
  isNotOwner(ownerId: number): boolean {
    if (ownerId != this.currentUserId)
      return true

    return false;
  }

  /**
   * Checks if the current user is of role Admin.
   * 
   * @returns {boolean} - `true` if the current user is an admin, `false` otherwise.
  */
  isAdmin(): boolean {
    if (this.currentUserIsAdmin)
      return true

    return false;
  }
}
