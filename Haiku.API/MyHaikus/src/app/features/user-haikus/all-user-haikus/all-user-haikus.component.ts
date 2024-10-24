import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { NavigationService } from '../../../core/services/navigation.service';
import { UserHaikuService } from '../../../core/services/user-haiku.service';
import { UserHaikuDto } from '../../../shared/models/userHaikuDto.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { AuthorizationService } from '../../../core/services/authorization.service';

/**
 * Component for displaying and managing all user haikus.
*/
@Component({
  selector: 'app-all-user-haikus',
  templateUrl: './all-user-haikus.component.html',
  styleUrls: [],
})
export class AllUserHaikusComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');
  private readonly adminRole = 1;

  currentUserIsAdmin: boolean | null = null;
  currentUserId: number | null = null;
  userHaikusDto: UserHaikuDto[] = [];
  filteredUserHaikusDto: UserHaikuDto[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  userHaikuIdToDelete: number | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  successMessages = {
    userHaikus: ""
  };

  errorMessages: { userHaikus: string | null } = {
    userHaikus: null,
  };

  loadingStates = {
    userHaikus: false
  };

  constructor(
    private userHaikuService: UserHaikuService,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private navigationService: NavigationService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.userHaikus = true;
    this.clearMessages();
    this.currentUserId = this.authenticationService.getUserId();
    this.currentUserIsAdmin = this.authorizationService.isAuthorizedForRoles(["Admin"]);
    this.loadUserHaikus();
  }

  /**
   * Clears any error messages related to author loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      userHaikus: null,
    };
    this.successMessages = {
      userHaikus: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., user haikus loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'userHaikus'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'userHaikus'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
    this.successMessages[type] = "";
  }

  /**
   * Loads a paginated list of user haikus based on the search term.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadUserHaikus(): void {
    this.loadingStates.userHaikus = true;

    this.searchText$.pipe(
      distinctUntilChanged(),
      switchMap(searchTerm => {
        return this.userHaikuService.getAllUserHaikus(this.currentPage, this.pageSize, searchTerm).pipe(
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
          this.loadUserHaikus();
        },
        error: error => this.handleError(error, 'userHaikus')
      });
    }
  }

  /**
   * Handles the user input event for searching user haikus. It updates the `searchText$` BehaviorSubject with the current value.
   * @returns {void} This method does not return a value.
  */
  search(): void {
    this.searchText$.next(this.searchTerm);
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
   * Checks if the current page has no author and changes the page to the first page if true.
   * 
   * @returns {void} This method does not return a value.
  */
  isPageEmpty(): void {
    if (this.filteredUserHaikusDto.length === 1) {
      this.onPageChange(1);
    }
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
   * Handles pagination by updating the current page and loading user haikus for that page.
   * 
   * @param {number} newPage - The new page number to load user haikus for.
   * @returns {void} This method does not return a value.
  */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadUserHaikus();
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
