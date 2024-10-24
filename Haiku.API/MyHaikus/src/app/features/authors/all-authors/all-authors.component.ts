import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthorService } from '../../../core/services/author.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthorDto } from '../../../shared/models/authorDto.model';

/**
 * Component for displaying and managing all authors.
*/
@Component({
  selector: 'app-all-authors',
  templateUrl: './all-authors.component.html',
  styleUrls: [],
})
export class AllAuthorsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');
  private readonly defaultAuthorId = 1;

  authorsDto: AuthorDto[] = [];
  filteredAuthorsDto: AuthorDto[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';
  authorIdToDelete: number | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  successMessages = {
    authors: ""
  };

  errorMessages: { authors: string | null } = {
    authors: null,
  };

  loadingStates = {
    authors: false
  };

  constructor(
    private authorService: AuthorService,
    private navigationService: NavigationService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.authors = true;
    this.clearMessages();

    this.loadAuthors();
  }

  /**
   * Clears any error messages related to authors loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      authors: null,
    };
    this.successMessages = {
      authors: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., authors loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'userHaikus'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'authors'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
  }

  /**
   * Loads a paginated list of authors based on the search term.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthors(): void {
    this.loadingStates.authors = true;

    this.searchText$.pipe(
      distinctUntilChanged(),
      switchMap(searchTerm => {
        return this.authorService.getAllAuthors(this.currentPage, this.pageSize, searchTerm).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loadingStates.authors = false)
        );
      })
    ).subscribe({
      next: ({ authors, paginationMetadata }) => {
        this.filteredAuthorsDto = authors;
        this.totalCount = paginationMetadata.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
      },
      error: error => this.handleError(error, 'authors')
    });
  }

  /**
   * Deletes a Author based on the Author ID stored in `authorIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteAuthor(): void {
    if (this.authorIdToDelete != null) {
      if (!this.isNotAuthorOne(this.authorIdToDelete)) {
        this.loadingStates.authors = true;

        this.authorService.deleteAuthor(this.authorIdToDelete).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loadingStates.authors = false)
        ).subscribe({
          next: () => {
            this.clearMessages();
            this.successMessages.authors = "Author deleted successfully!";
            this.authorIdToDelete = null;
            this.isPageEmpty();
            this.loadAuthors()
          },
          error: error => this.handleError(error, 'authors')
        });
      }
    }
  }

  /**
   * Handles the user input event for searching authors. It updates the `searchText$` BehaviorSubject with the current value.
   * @returns {void} This method does not return a value.
  */
  search(): void {
    this.searchText$.next(this.searchTerm);
  }

  /**
   * Navigates the authorview by ID.
   *
   * @param {number} authorId - The Author ID.
   * @returns {void} This method does not return a value.
  */
  viewAuthor(authorId: number): void {
    this.navigationService.viewAuthor(authorId);
  }

  /**
   * Navigates the author update by ID.
   *
   * @param {number} authorId - The Author ID.
   * @returns {void} This method does not return a value.
  */
  updateAuthor(authorId: number): void {
    this.navigationService.updateAuthor(authorId);
  }

  /**
   * Opens a modal for author deletion confirmation by setting the author ID to delete.
   *
   * @param {number} authorId - The ID of the author to be deleted.
   * @returns {void} This method does not return a value.
  */
  openAuthorModal(authorId: number): void {
    this.authorIdToDelete = authorId;
  }

  /**
   * Toggles the sorting direction and sorts the filtered authors by name.
   * 
   * @returns {void} This method does not return a value.
  */
  sortByName(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredAuthorsDto.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return this.sortDirection === 'asc' ? (nameA < nameB ? -1 : 1) : (nameA > nameB ? -1 : 1);
    });
  }

  /**
   * Checks if the current page has no author and changes the page to the first page if true.
   * 
   * @returns {void} This method does not return a value.
  */
  isPageEmpty(): void {
    if (this.filteredAuthorsDto.length === 1) {
      this.onPageChange(1);
    }
  }

  /**
   * Handles pagination by updating the current page and loading authors for that page.
   * 
   * @param {number} newPage - The new page number to load authors for.
   * @returns {void} This method does not return a value.
  */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadAuthors();
  }

  /**
   * Checks if the provided author ID is not equal to the default Author ID.
   * 
   * @param {number} authorId - The ID of the author to check.
   * @returns {boolean} - Returns `true` if the author ID is equal to the default Author ID, otherwise returns `false`.
  */
  isNotAuthorOne(authorId: number): boolean {
    if (authorId == this.defaultAuthorId)
      return true

    return false;
  }
}

