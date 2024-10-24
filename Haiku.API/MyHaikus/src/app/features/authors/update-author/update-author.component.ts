import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Subject, takeUntil } from "rxjs";
import { OnInit } from "@angular/core";
import { AuthorService } from "../../../core/services/author.service";
import { AuthorDto } from "../../../shared/models/authorDto.model";

/**
 * A component for updating an author.
*/
@Component({
  selector: 'app-update-author',
  templateUrl: './update-author.component.html',
  styleUrls: ['./update-author.component.css']
})
export class UpdateAuthorComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private readonly defaultAuthorId = 1;

  authorDto: AuthorDto = { id: 0, name: '', bio: '' };
  authorIdToUpdate: number | null = null;

  errorMessages: { update: string | null } = {
    update: null,
  };

  loadingStates = {
    update: false,
  };

  constructor(
    private authorService: AuthorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.update = true;
    this.clearMessages();

    this.authorIdToUpdate = +this.route.snapshot.paramMap.get('id')!;

    if (this.authorIdToUpdate)
      this.loadAuthorById(this.authorIdToUpdate);
  }

  /**
   * Clears any error messages related to add loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      update: null,
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
  }

  /**
   * Loads the specific author by its ID and assigns it to the component's `authorDto`.
   * 
   * @param {number} authorId - The ID of the author to load.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthorById(authorId: number): void {
    this.loadingStates.update = true;

    if (!this.isNotAuthorOne(authorId)) {
      this.authorService.getAuthorById(authorId).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.loadingStates.update = false;
        })
      ).subscribe({
        next: author => {
          this.authorDto = author;
        },
        error: error => this.handleError(error, 'update')
      });
    }
    this.loadingStates.update = false;
  }

  /**
   * Updates an existing author and navigates to the author view page.
   * 
   * @param {AuthorDto} updatedAuthor - The data transfer object containing the updated author details.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  updateAuthor(updatedAuthor: AuthorDto): void {
    this.loadingStates.update = true;

    if (!this.isNotAuthorOne(updatedAuthor.id)) {
      this.authorService.updateAuthor(updatedAuthor.id, updatedAuthor).pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          this.loadingStates.update = false;
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/view-author', updatedAuthor.id]);
        },
        error: error => this.handleError(error, 'update')
      });
    }
    this.loadingStates.update = false;
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
