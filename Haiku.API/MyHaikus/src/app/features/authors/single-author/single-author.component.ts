import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, BehaviorSubject, takeUntil, finalize, distinctUntilChanged, switchMap } from "rxjs";
import { AuthorHaikuService } from "../../../core/services/author-haiku.service";
import { AuthorService } from "../../../core/services/author.service";
import { NavigationService } from "../../../core/services/navigation.service";
import { AuthorDto } from "../../../shared/models/authorDto.model";
import { AuthorHaikuDto } from "../../../shared/models/authorHaikuDto.model";

/**
 * Component for displaying and managing a author and author haikus.
*/
@Component({
  selector: 'app-single-author',
  templateUrl: './single-author.component.html',
  styleUrls: ['./single-author.component.css']
})
export class SingleAuthorComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');
  private readonly defaultAuthorId = 1;

  authorDto: AuthorDto = { id: 0, name: '', bio: '' };
  filteredAuthorHaikusDto: AuthorHaikuDto[] = [];

  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';

  authorId: number | null = null;
  authorIdToDelete: number | null = null;
  authorHaikuIdToDelete: number | null = null;

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;

  successMessages = {
    author: "",
    authorHaikus: ""
  };

  errorMessages: { author: string | null, authorHaikus: string | null } = {
    author: null,
    authorHaikus: null,
  };

  loadingStates = {
    author: false,
    authorHaikus: false
  };

  constructor(
    private route: ActivatedRoute,
    private authorHaikuService: AuthorHaikuService,
    private authorService: AuthorService,
    private navigationService: NavigationService,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.author = true;
    this.clearMessages();

    this.authorId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.authorId)
      this.loadAuthorAndHaikus(this.authorId);
  }

  /**
   * Clears any error messages related to author and author haiku loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      author: null,
      authorHaikus: null,
    };
    this.successMessages = {
      author: "",
      authorHaikus: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., author, author haiku loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'author'} type - The type of operation encountering the error.
   * @param {'authorHaikus'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'author' | 'authorHaikus'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
    this.successMessages[type] = "";
  }

  /**
   * Loads author by author ID, proceeds to load author haiku.
   * @param {number} authorId - The ID of the author to load
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthorAndHaikus(authorId: number): void {
    this.loadingStates.author = true;

    this.authorService.getAuthorById(authorId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.author = false;
      })
    ).subscribe({
      next: author => {
        this.authorDto = author;
        this.loadAuthorHaikusByAuthorId(authorId);
      },
      error: error => this.handleError(error, 'author')
    });
  }

  /**
   * Loads paginated list of author haikus by  author ID.
   * @param {number} authorId - The ID of the author to load author haikus.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthorHaikusByAuthorId(authorId: number): void {
    this.loadingStates.authorHaikus = true;

    this.searchText$.pipe(
      distinctUntilChanged(),
      switchMap(searchTerm => {
        return this.authorHaikuService.getAllAuthorHaikusByAuthorId(authorId, this.currentPage, this.pageSize, searchTerm).pipe(
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
   * Deletes a author based on the author ID stored in `authorIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteAuthor(): void {
    if (this.authorIdToDelete != null) {
      if (!this.isNotAuthorOne(this.authorIdToDelete)) {
        this.loadingStates.author = true;
        this.authorService.deleteAuthor(this.authorIdToDelete).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loadingStates.author = false)
        ).subscribe({
          next: () => this.viewAuthors(),
          error: error => this.handleError(error, 'author')
        });
      }
    }
  }

  /**
   * Deletes a author haiku based on the author haiku ID stored in `authorHaikuIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteAuthorHaiku(): void {
    if (this.authorHaikuIdToDelete) {
      this.loadingStates.authorHaikus = true;

      this.authorHaikuService.deleteAuthorHaiku(this.authorHaikuIdToDelete).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => this.loadingStates.authorHaikus = false)
      ).subscribe({
        next: () => {
          this.clearMessages();
          this.successMessages.authorHaikus = "Haiku deleted successfully!";
          this.authorHaikuIdToDelete = null;

          this.isPageEmpty();
          this.loadAuthorHaikusByAuthorId(this.authorDto.id);
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
   * @param {number} authorId - The Author haiku ID.
   * @returns {void} This method does not return a value.
  */
  viewAuthorHaiku(authorHaikuId: number): void {
    this.navigationService.viewAuthorHaiku(authorHaikuId);
  }

  /**
   * Navigates to all authors.
   *
   * @returns {void} This method does not return a value.
  */
  viewAuthors(): void {
    this.navigationService.viewAuthors();
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
   * Navigates the author haiku update by ID.
   *
   * @param {number} authorId - The Author haiku ID.
   * @returns {void} This method does not return a value.
  */
  updateAuthorHaiku(authorHaikuId: number): void {
    this.navigationService.updateAuthorHaiku(authorHaikuId);
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
   * Opens a modal for author haiku deletion confirmation by setting the author haiku ID to delete.
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
   * Handles pagination by updating the current page and loading author haikus for that page.
   * 
   * @param {number} newPage - The new page number to load authors for.
   * @returns {void} This method does not return a value.
  */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadAuthorHaikusByAuthorId(this.authorDto.id);
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
