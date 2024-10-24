import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subject, takeUntil, finalize } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthorHaikuService } from "../../../core/services/author-haiku.service";
import { AuthorService } from "../../../core/services/author.service";
import { AuthorHaikuDto } from "../../../shared/models/authorHaikuDto.model";

@Component({
  selector: 'app-update-authorHaiku',
  templateUrl: './update-author-haiku.component.html',
  styleUrls: ['./update-author-haiku.component.css']
})
export class UpdateAuthorHaikuComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  authorHaikuDto: AuthorHaikuDto = { id: 0, title: '', lineOne: '', lineTwo: '', lineThree: '', authorId: 0 };

  errorMessages: { update: string | null } = {
    update: null,
  };

  loadingStates = {
    update: false,
  };

  constructor(
    private authorHaikuService: AuthorHaikuService,
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

    const authorHaikuIdToUpdate = +this.route.snapshot.paramMap.get('id')!;
    if (authorHaikuIdToUpdate)
      this.loadAuthorHaikuById(authorHaikuIdToUpdate);
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
   * Loads the haiku for a specific author by its ID and assigns it to the component's `authorHaikuDto`.
   * 
   * @param {number} authorHaikuId - The ID of the author's haiku to load.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthorHaikuById(authorHaikuId: number): void {
    this.loadingStates.update = true;

    this.authorHaikuService.getAuthorHaikuById(authorHaikuId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.update = false;
      })
    ).subscribe({
      next: authorHaiku => {
        this.authorHaikuDto = authorHaiku;
      },
      error: error => this.handleError(error, 'update')
    });
  }

  /**
   * Updates an existing author's haiku and navigates to the haiku view page.
   * 
   * @param {AuthorHaikuDto} updatedAuthorHaiku - The data transfer object containing the updated haiku details.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  updateAuthorHaiku(updatedAuthorHaiku: AuthorHaikuDto): void {
    this.loadingStates.update = true;

    this.authorHaikuService.updateAuthorHaiku(updatedAuthorHaiku.id, updatedAuthorHaiku).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.update = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/view-author-haiku', updatedAuthorHaiku.id]);
      },
      error: error => this.handleError(error, 'update')
    });
  }
}
