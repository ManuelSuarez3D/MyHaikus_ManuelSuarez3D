import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, finalize, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { NavigationService } from '../../../core/services/navigation.service';
import { ProfileService } from '../../../core/services/profile.service';
import { UserService } from '../../../core/services/user.service';
import { AccountDto } from '../../../shared/models/accountDto.model';
import { ProfileDto } from '../../../shared/models/profileDto.model';
import { UserDto } from '../../../shared/models/userDto.model';

/**
 * Component for displaying and managing all users.
*/
@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: [],
})
export class AllUsersComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');
  private readonly adminRole = 1;

  usersDto: UserDto[] = [];
  filteredAccountsDto: AccountDto[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  userIdToDelete: number | null = null;
  userToDeleteRoleId: number | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  successMessages = {
    users: "",
    profiles: ""
  };

  errorMessages: { users: string | null, profiles: string | null } = {
    users: null,
    profiles: null
  };

  loadingStates = {
    users: false,
    profiles: false
  };

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private navigationService: NavigationService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.users = true;
    this.clearMessages();
    this.loadUsersAndProfiles();
  }

  /**
   * Clears any error messages related to author loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      users: null,
      profiles: null
    };
    this.successMessages = {
      users: "",
      profiles: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., users loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'users'} type - The type of operation encountering the error.
   * @param {'profiles'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'users' | 'profiles'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
    this.successMessages[type] = "";
  }

  /**
   * Loads a paginated list of users based on the search term, then loads their profiles by user IDs.
   * Updates the component's `filteredAccountsDto` with the combined user and profile data.
   * Also manages the pagination metadata for displaying the total count and pages.
   *
   * @returns {void} This method does not return a value.
   * 
   * @throws Will call `handleError` with an error message on failure.
   */
  loadUsersAndProfiles(): void {
    this.loadingStates.users = true;

    this.searchText$
    .pipe(
      distinctUntilChanged(),
      switchMap(searchTerm => {
        return this.userService.getAllUsers(this.currentPage, this.pageSize, searchTerm).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => { this.loadingStates.users = false; })
        );
      }),
      switchMap(({ users, paginationMetadata }) => {
        const userIds = users.map(user => user.id);

        if (userIds.length === 0) {
          return of({ users, profiles: [], paginationMetadata });
        }

        this.loadingStates.profiles = true;
        return this.profileService.getAllProfilesByUserIds(userIds).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => { this.loadingStates.profiles = false; }),
          map(({ profiles }) => ({ users, profiles, paginationMetadata }))
        );
      })
    )
    .subscribe({
      next: ({ users, profiles, paginationMetadata }) => {
        this.filteredAccountsDto = users.map(user => {
          const profile = profiles.find((profile: ProfileDto) => profile.userId === user.id);
          return {
            ...user,
            bio: profile?.bio || 'Empty Bio Error',
            filePath: '',
          };
        });

        this.totalCount = paginationMetadata.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
      },
      error: error => this.handleError(error, 'users')
    });
  }

  /**
   * Deletes a user based on the provided user ID and role ID.
   * 
   * If the user is not an admin (determined by the `isNotAdmin` method), 
   * it sets the loading state to true, invokes the user service to delete the user,
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
   */
  deleteUser(): void {
    if (this.userIdToDelete && this.userToDeleteRoleId) {
      if (this.isNotAdmin(this.userToDeleteRoleId)) {
        this.loadingStates.users = true;

        this.userService.deleteUser(this.userIdToDelete).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loadingStates.users = false)
        ).subscribe({
          next: () => {
            this.clearMessages();
            this.successMessages.users = "User deleted successfully!";
            this.userIdToDelete = null;
            this.userToDeleteRoleId = null;
            this.loadUsersAndProfiles();
          },
          error: error => this.handleError(error, 'users')
        });
      }
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
   * Navigates the user view by ID.
   *
   * @param {number} userId - The User ID.
   * @returns {void} This method does not return a value.
  */
  viewUser(userId: number): void {
    this.navigationService.viewUser(userId);
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
   * Toggles the sorting direction and sorts the filtered user by username.
   * 
   * @returns {void} This method does not return a value.
  */
  sortByUsername(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredAccountsDto.sort((a, b) => {
      const usernameA = a.username.toLowerCase();
      const usernameB = b.username.toLowerCase();
      return this.sortDirection === 'asc' ? (usernameA < usernameB ? -1 : 1) : (usernameA > usernameB ? -1 : 1);
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
    this.loadUsersAndProfiles();
  }

  /**
   * Checks if the current page has no user and changes the page to the first page if true.
   * 
   * @returns {void} This method does not return a value.
  */
  isPageEmpty(): void {
    if (this.filteredAccountsDto.length === 1) {
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
  isNotAdmin(roleId: number): boolean {
    if (roleId != this.adminRole)
      return true

    return false;
  }
}
