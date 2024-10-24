import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';
import { AuthorHaikuService } from '../../../core/services/author-haiku.service';
import { AuthorService } from '../../../core/services/author.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthorDto } from '../../../shared/models/authorDto.model';
import { AuthorHaikuDto } from '../../../shared/models/authorHaikuDto.model';

@Component({
  selector: 'app-single-author-haiku',
  templateUrl: './single-author-haiku.component.html',
  styleUrls: ['./single-author-haiku.component.css']
})
export class SingleAuthorHaikuComponent implements OnInit, OnDestroy { 
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');
  private readonly defaultAuthorId = 1;

  authorHaikuDto: AuthorHaikuDto = { id: 0, title: '', lineOne: '', lineTwo: '', lineThree: '', authorId: 0 };
  authorDto: AuthorDto = { id: 0, name: '', bio: '' };

  authorHaikuId: number | null = null;
  authorHaikuIdToDelete: number | null = null;
  authorIdToDelete: number | null = null;

  errorMessages: { author: string | null, authorHaiku: string | null } = {
    author: null,
    authorHaiku: null,
  };

  loadingStates = {
    author: false,
    authorHaiku: false
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

    this.authorHaikuId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.authorHaikuId)
      this.loadAuthorHaikuAndAuthor(this.authorHaikuId);
  }

  /**
   * Clears any error messages related to author loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      author: null,
      authorHaiku: null,
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., author, author haiku loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'author'} type - The type of operation encountering the error.
   * @param {'authorHaiku'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'author' | 'authorHaiku'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
  }

  /**
   * Loads a author haiku by ID, proceeds to load the author by ID.
   * @param {number} authorHaikuId - The ID of the author haiku to load.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthorHaikuAndAuthor(authorHaikuId: number): void {
    this.loadingStates.authorHaiku = true;

    this.authorHaikuService.getAuthorHaikuById(authorHaikuId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.authorHaiku = false;
      })
    ).subscribe({
      next: authorHaiku => {
        this.authorHaikuDto = authorHaiku;
        this.loadAuthor(this.authorHaikuDto.authorId);
      },
      error: error => this.handleError(error, 'authorHaiku')
    });
  }

  /**
   * Loads a author by ID.
   * @param {number} authorId - The ID of the author to load.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthor(authorId: number): void {
    this.loadingStates.author = true;

    this.authorService.getAuthorById(authorId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.author = false;
      })
    ).subscribe({
      next: author => {
        this.authorDto = author;
      },
      error: error => this.handleError(error, 'author')
    });
  }

  /**
   * Deletes a author haiku based on the author haiku ID stored in `authorHaikuIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteAuthorHaiku(): void {
    if (this.authorHaikuIdToDelete != null) {
      this.loadingStates.authorHaiku = true;

      this.authorHaikuService.deleteAuthorHaiku(this.authorHaikuIdToDelete).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.loadingStates.authorHaiku = false;
        })
      ).subscribe({
        next: () => {
          this.authorHaikuIdToDelete = null;
          this.viewAuthorHaikus();
        },
        error: error => this.handleError(error, 'authorHaiku')
      });
    }
  }

  /**
   * Deletes a author based on the author ID stored in `authorIdToDelete`.
   * 
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  deleteAuthor(): void {
    if (this.authorIdToDelete != null) {
      this.loadingStates.author = true;

      this.authorService.deleteAuthor(this.authorIdToDelete).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.loadingStates.author = false;
        })
      ).subscribe({
        next: () => {
          this.authorIdToDelete = null;
          this.loadAuthorHaikuAndAuthor(this.authorHaikuDto.id);
        },
        error: error => this.handleError(error, 'author')
      });
    }
  }

  /**
   * Navigates the author view by ID.
   *
   * @param {number} authorId - The Author ID.
   * @returns {void} This method does not return a value.
  */
  viewAuthor(authorId: number): void {
    this.navigationService.viewAuthor(authorId);
  }

  /**
   * Navigates the author view by ID.
   *
   * @param {number} authorId - The Author ID.
   * @returns {void} This method does not return a value.
  */
  updateAuthor(authorId: number): void {
    this.navigationService.updateAuthor(authorId);
  }

  /**
   * Navigates to all author haikus view by ID.
   *
   * @returns {void} This method does not return a value.
  */
  viewAuthorHaikus(): void {
    this.navigationService.viewAuthorHaikus();
  }

  /**
   * Navigates the author haiku update  by ID.
   *
   * @param {number} authorHaikuId - The Author Haiku ID.
   * @returns {void} This method does not return a value.
  */
  updateAuthorHaiku(authorHaikuId: number): void {
    this.navigationService.updateAuthorHaiku(authorHaikuId);
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
   * Opens a modal for author deletion confirmation by setting the author ID to delete.
   *
   * @param {number} authorId - The ID of the author to be deleted.
   * @returns {void} This method does not return a value.
  */
  openAuthorModal(authorId: number): void {
    this.authorIdToDelete = authorId;
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
