import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, BehaviorSubject, takeUntil, finalize, distinctUntilChanged, switchMap, map, of } from "rxjs";
import { NavigationService } from "../../../core/services/navigation.service";
import { ProfileService } from "../../../core/services/profile.service";
import { UserHaikuService } from "../../../core/services/user-haiku.service";
import { UserService } from "../../../core/services/user.service";
import { AccountDto } from "../../../shared/models/accountDto.model";
import { UserHaikuDto } from "../../../shared/models/userHaikuDto.model";
import { ImageService } from "../../../core/services/image.service";
import { AuthenticationService } from "../../../core/services/authentication.service";

/**
 * Component for displaying and managing a user and user haikus.
*/
@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');
  private readonly adminRole = 1;
  private readonly defaultUrl = "http://localhost:5104";

  accountDto: AccountDto = { id: 0, username: '', password: '', roleId: 0, bio: '', filePath: '' };
  filteredUserHaikusDto: UserHaikuDto[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';

  currentUserId: number | null = null;
  userId: number | null = null;
  userIdToDelete: number | null = null;
  userToDeleteRoleId: number | null = null;
  userHaikuIdToDelete: number | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  successMessages = {
    user: "",
    userHaikus: ""
  };

  errorMessages: { user: string | null, userHaikus: string | null } = {
    user: null,
    userHaikus: null,
  };

  loadingStates = {
    user: false,
    userHaikus: false
  };

  constructor(
    private route: ActivatedRoute,
    private userHaikuService: UserHaikuService,
    private userService: UserService,
    private profileService: ProfileService,
    private imageService: ImageService,
    private authService: AuthenticationService,
    private navigationService: NavigationService,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.user = true;
    this.clearMessages();

    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUserId = this.authService.getUserId();

    if (this.userId)
      this.loadUserAndProfile(this.userId);
  }

  /**
   * Clears any error messages related to user loading.
  */
  private clearMessages(): void {
    this.errorMessages = {
      user: null,
      userHaikus: null,
    };
    this.successMessages = {
      user: "",
      userHaikus: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., user, user haiku loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'user'} type - The type of operation encountering the error.
   * @param {'userHaikus'} type - The type of operation encountering the error.
  */
  private handleError(error: any, type: 'user'| 'userHaikus'): void {
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
        this.loadUserHaikusByUserId(userId);
      },
      error: (error) => this.handleError(error, 'user')
    });
  }

  /**
   * Loads paginated list of user haikus by user ID.
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
  }

  /**
   * Deletes a user based on the user haiku ID stored in `userIdToDelete`.
   *
   * This method checks if the user ID and role ID of the user to be deleted are defined.
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
          next: () => this.viewUsers(),
          error: error => this.handleError(error, 'user')
        });
      }
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
    if (this.userId)
      this.loadUserHaikusByUserId(this.userId);
  }

  /**
   * Navigates the user haiku view by ID.
   *
   * @param {number} userHaikuId - The User Haiku ID.
   * @returns {void} This method does not return a value.
  */
  viewUserHaiku(userHaikuId: number): void {
    this.navigationService.viewUserHaiku(userHaikuId);
  }

  /**
   * Navigates the user haiku update by ID.
   *
   * @param {number} userHaikuId - The User Haiku ID.
   * @returns {void} This method does not return a value.
  */
  updateUserHaiku(userHaikuId: number): void {
    this.navigationService.updateUserHaiku(userHaikuId);
  }

  /**
   * Navigates to all users view by ID.
   *
   * @returns {void} This method does not return a value.
  */
  viewUsers(): void {
    this.navigationService.viewUsers();
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
   * Toggles the sorting direction and sorts the filtered user by title.
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
   * Handles pagination by updating the current page and loading user haikus for that page.
   * 
   * @param {number} newPage - The new page number to load user haikus for.
   * @returns {void} This method does not return a value.
  */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    if (this.userId)
      this.loadUserHaikusByUserId(this.userId);
  }

  /**
   * Checks if the current page has no user and changes the page to the first page if true.
   * 
   * @returns {void} This method does not return a value.
  */
  isPageEmpty(): void {
    if (this.filteredUserHaikusDto.length === 1) {
      this.onPageChange(1);
    }
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
}
