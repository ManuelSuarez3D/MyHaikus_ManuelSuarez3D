import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, takeUntil, finalize, distinctUntilChanged, switchMap, map, of } from "rxjs";
import { AuthenticationService } from "../../core/services/authentication.service";
import { NavigationService } from "../../core/services/navigation.service";
import { ProfileService } from "../../core/services/profile.service";
import { UserHaikuService } from "../../core/services/user-haiku.service";
import { UserService } from "../../core/services/user.service";
import { AccountDto } from "../../shared/models/accountDto.model";
import { ProfileDto } from "../../shared/models/profileDto.model";
import { UserHaikuDto } from "../../shared/models/userHaikuDto.model";
import { ImageService } from "../../core/services/image.service";

/**
 * Component for managing user profile functionalities, including displaying and editing user information,
 * uploading profile images, and managing user haikus. 
*/
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');
  private readonly defaultUrl = "http://localhost:5104";

  selectedFile: File | null = null;
  accountDto: AccountDto = { id: 0, username: '', password: '', roleId: 0, bio: '', filePath: '' };
  profileDto: ProfileDto = { id: 0, bio: '', userId: 0, imageId: 0 };
  filteredUserHaikusDto: UserHaikuDto[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';

  userId: number | null = null;
  userIdToDelete: number | null = null;
  userHaikuIdToDelete: number | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  successMessages = {
    upload: "",
    userHaikus: "",
    user: ""
  };

  errorMessages: { upload: string | null, userHaikus: string | null, user: string | null } = {
    upload: null,
    userHaikus: null,
    user: null
  };

  loadingStates = {
    upload: false,
    userHaikus: false,
    user: false
  };

  constructor(
    private userHaikuService: UserHaikuService,
    private userService: UserService,
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private imageService: ImageService,
    private navigationService: NavigationService,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.clearMessages();

    this.userId = this.authService.getUserId();

    if (this.userId)
      this.loadUserAndProfile(this.userId);
  } 
  
  /**
   * Clears any error messages related to author haikus loading.
  */
  private clearMessages(): void {
    this.errorMessages = {
      upload: null,
      userHaikus: null,
      user: null
    };
    this.successMessages = {
      upload: "",
      userHaikus: "",
      user: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., user haikus. upload, user loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'upload'} type - The type of operation encountering the error.
   * @param {'userHaikus'} type - The type of operation encountering the error.
   * @param {'user'} type - The type of operation encountering the error.
  */
  private handleError(error: any, type: 'upload' | 'userHaikus' | 'user'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
    this.successMessages[type] = "";
  }

  /**
   * Loads a user by the user ID, proceeds to load user haikus.
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
            if (profile.imageId) {
              return this.imageService.getImageById(profile.imageId).pipe(
                takeUntil(this.unsubscribe$),
                map(image => ({ user, profile, image }))
              );
            } else {
              return of({ user, profile, image: null });
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
          filePath: image?.filePath || 'Empty Image Error'
        };
        this.profileDto = profile;
        this.loadUserHaikusByUserId(userId);
      },
      error: (error) => this.handleError(error, 'user')
    });
  }

  /**
   * Loads a user haikus by the user ID.
   * @param {number} userId - The ID of the user to load user haikus.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadUserHaikusByUserId(userId: number): void {
    this.loadingStates.userHaikus = true;

    this.searchText$.pipe(
      distinctUntilChanged(),
      switchMap(searchTerm => {
        return this.userHaikuService.getAllUserHaikusByUserId(userId, this.currentPage, this.pageSize, searchTerm).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loadingStates.userHaikus = false)
        );
      })
    ).subscribe({
      next: ({ userHaikus, paginationMetadata }) => {
        this.filteredUserHaikusDto = userHaikus;
        this.totalCount = paginationMetadata.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
      },
      error: error => this.handleError(error, 'userHaikus')
    });
  };

  /**
   * Uploads the selected profile image and updates the user's profile with the new image URL.
   * If the image upload is successful, it reloads the user's profile with the new image.
   *
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
   */
  updateProfileImg(): void {
    this.loadingStates.upload = true;

    if (this.selectedFile && this.userId != null) {
      this.imageService.uploadImage(this.selectedFile, this.profileDto.imageId, this.profileDto.id).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loadingStates.upload = false)
      ).subscribe({
        next: () => {
          this.clearMessages();
          this.successMessages.upload = 'Image uploaded successfully!';

          if (this.userId != null) {
            this.loadUserAndProfile(this.userId);
          }
        },
        error: (error) => this.handleError(error, 'upload')
      });
    }
  }

  /**
   * Handles the event when a file is selected by the user and triggers the profile image update.
   *
   * @param {any} event - The event object containing the selected file.
   * @returns {void} This method does not return a value.
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.updateProfileImg();
    }
  }

  /**
   * Deletes a user based on the user ID stored in `userIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteUser(): void {
    if (this.userIdToDelete) {
      this.loadingStates.user = true;

      this.userService.deleteUser(this.userIdToDelete).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loadingStates.user = false)
      ).subscribe({
        next: () => this.viewUsers(),
        error: error => this.handleError(error, 'user')
      });
    }
  }

  /**
   * Deletes a user haiku based on the user haiku ID stored in `userHaikuIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteUserHaiku(): void {
    if (this.userHaikuIdToDelete) {
      this.loadingStates.userHaikus = true;

      this.userHaikuService.deleteUserHaiku(this.userHaikuIdToDelete).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loadingStates.userHaikus = false)
      ).subscribe({
        next: () => {
          this.clearMessages();
          this.successMessages.userHaikus = "User Haiku deleted successfully!";
          this.userHaikuIdToDelete = null;
          this.isPageEmpty();
          if (this.userId)
            this.loadUserHaikusByUserId(this.userId);
        },
        error: error => this.handleError(error, 'user')
      });
    }
  }

  /**
   * Handles the user input event for searching user haikus. It updates the `searchText$` BehaviorSubject with the current value.
  */
  search(): void {
    this.searchText$.next(this.searchTerm);
  }

  /**
   * Navigates the User Haiku view by ID.
   *
   * @param {number} userHaikuId - The User Haiku ID.
   * @returns {void} This method does not return a value.
  */
  viewUserHaiku(userHaikuId: number): void {
    this.navigationService.viewUserHaiku(userHaikuId);
  }

  /**
   * Navigates the update User Haiku view by ID.
   *
   * @param {number} userHaikuId - The User Haiku ID.
   * @returns {void} This method does not return a value.
  */
  updateUserHaiku(userHaikuId: number): void {
    this.navigationService.updateUserHaiku(userHaikuId);
  }

  /**
   * Navigates the all Users view.
   *
   * @returns {void} This method does not return a value.
  */
  viewUsers(): void {
    this.navigationService.viewUsers();
  }

  /**
   * Navigates the update User or Profile view.
   *
   * @returns {void} This method does not return a value.
  */
  updateUserOrProfile(): void {
    this.navigationService.updateUserOrProfile();
  }

  /**
   * Opens a modal for user deletion confirmation by setting the user ID to delete.
   *
   * @param {number} userId - The ID of the user to be deleted.
   * @returns {void} This method does not return a value.
  */
  openUserModal(userId: number): void {
    this.userIdToDelete = userId;
  }

  /**
   * Opens a modal for user deletion confirmation by setting the user haiku ID to delete.
   *
   * @param {number} userHaikuId - The ID of the user haiku to be deleted.
   * @returns {void} This method does not return a value.
  */
  openUserHaikuModal(userHaikuId: number): void {
    this.userHaikuIdToDelete = userHaikuId;
  }

  /**
   * Toggles the sorting direction and sorts the filtered user haikus by title.
   * 
   * @returns {void} This method does not return a value.
  */
  sortByTitle(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredUserHaikusDto.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return this.sortDirection === 'asc' ? (titleA < titleB ? -1 : 1) : (titleA > titleB ? -1 : 1);
    });
  }

  /**
   * Checks if the current page has no user haikus and changes the page to the first page if true.
   * 
   * @returns {void} This method does not return a value.
  */
  isPageEmpty(): void {
    if (this.filteredUserHaikusDto.length === 1) {
      this.onPageChange(1);
    }
  }

  /**
   * Handles pagination by updating the current page and loading user haikus for that page.
   * 
   * @param {number} newPage - The new page number to load user haikus for.
   * @returns {void} This method does not return a value.
  */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadUserHaikusByUserId(this.accountDto.id);
  }
}
