import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthorHaikuService } from '../../../core/services/author-haiku.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthorHaikuDto } from '../../../shared/models/authorHaikuDto.model';

@Component({
  selector: 'app-all-author-haikus',
  templateUrl: './all-author-haikus.component.html',
  styleUrls: [],
})
export class AllAuthorHaikusComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');

  authorHaikusDto: AuthorHaikuDto[] = [];
  filteredAuthorHaikusDto: AuthorHaikuDto[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  authorHaikuIdToDelete: number | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  successMessages = {
    authorHaikus: ""
  };

  errorMessages: { authorHaikus: string | null } = {
    authorHaikus: null,
  };

  loadingStates = {
    authorHaikus: false
  };
  constructor(
    private authorHaikuService: AuthorHaikuService,
    private navigationService: NavigationService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.authorHaikus = true;
    this.clearMessages();

    this.loadAuthorHaikus();
  }

  /**
   * Clears any error messages related to author haikus loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      authorHaikus: null,
    };
    this.successMessages = {
      authorHaikus: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., author haikus loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'authorHaikus'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'authorHaikus'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
    this.successMessages[type] = "";
  }

  /**
   * Loads a paginated list of author haikus based on the search term.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthorHaikus(): void {
    this.loadingStates.authorHaikus = true;

    this.searchText$.pipe(
      distinctUntilChanged(),
      switchMap(searchTerm => {
        return this.authorHaikuService.getAllAuthorHaikus(this.currentPage, this.pageSize, searchTerm).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loadingStates.authorHaikus = false)
        );
      })
    ).subscribe({
      next: ({ authorHaikus, paginationMetadata }) => {
        this.filteredAuthorHaikusDto = authorHaikus;
        this.totalCount = paginationMetadata.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
      },
      error: error => this.handleError(error, 'authorHaikus')
    });
  }

  /**
   * Deletes a author haiku based on the user haiku ID stored in `authorHaikuIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteAuthorHaiku(): void {
    if (this.authorHaikuIdToDelete) {
      this.loadingStates.authorHaikus = true;

      this.authorHaikuService.deleteAuthorHaiku(this.authorHaikuIdToDelete).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.loadingStates.authorHaikus = false;
        })
      ).subscribe({
        next: () => {
          this.clearMessages();
          this.successMessages.authorHaikus = "Author Haiku deleted successfully!";
          this.authorHaikuIdToDelete = null;
          this.isPageEmpty();
          this.loadAuthorHaikus();
        },
        error: error => this.handleError(error, 'authorHaikus')
      });
    }
  }

  /**
   * Handles the user input event for searching author haikus. It updates the `searchText$` BehaviorSubject with the current value.
   * @returns {void} This method does not return a value.
  */
  search(): void {
    this.searchText$.next(this.searchTerm);
  }

  /**
   * Navigates the author haiku view by ID.
   *
   * @param {number} authorHaikuId - The Author Haiku ID.
   * @returns {void} This method does not return a value.
  */
  viewAuthorHaiku(authorHaikuId: number): void {
    this.navigationService.viewAuthorHaiku(authorHaikuId);
  }

  /**
   * Navigates the author haiku update by ID.
   *
   * @param {number} authorHaikuId - The Author Haiku ID.
   * @returns {void} This method does not return a value.
  */
  updateAuthorHaiku(authorHaikuId: number): void {
    this.navigationService.updateAuthorHaiku(authorHaikuId);
  }

  /**
   * Opens a modal for author deletion confirmation by setting the user haiku ID to delete.
   *
   * @param {number} authorHaikuId - The ID of the author haiku to be deleted.
   * @returns {void} This method does not return a value.
  */
  openAuthorHaikuModal(authorHaikuId: number): void {
    this.authorHaikuIdToDelete = authorHaikuId;
  }

  /**
   * Toggles the sorting direction and sorts the filtered author haikus by title.
   * 
   * @returns {void} This method does not return a value.
  */
  sortByTitle(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredAuthorHaikusDto.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return this.sortDirection === 'asc' ? (titleA < titleB ? -1 : 1) : (titleA > titleB ? -1 : 1);
    });
  }

  /**
   * Checks if the current page has no author haikus and changes the page to the first page if true.
   * 
   * @returns {void} This method does not return a value.
  */
  isPageEmpty(): void {
    if (this.filteredAuthorHaikusDto.length === 1) {
      this.onPageChange(1);
    }
  }

  /**
   * Handles pagination by updating the current page and loading author haikus for that page.
   * 
   * @param {number} newPage - The new page number to load author haikus for.
   * @returns {void} This method does not return a value.
  */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadAuthorHaikus();
  }
}
