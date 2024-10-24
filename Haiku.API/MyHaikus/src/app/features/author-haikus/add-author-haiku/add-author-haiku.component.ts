import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { finalize, Subject, takeUntil } from "rxjs";
import { OnInit } from "@angular/core";
import { AuthorHaikuService } from "../../../core/services/author-haiku.service";
import { AuthorHaikuDto } from "../../../shared/models/authorHaikuDto.model";

@Component({
  selector: 'app-add-author-haiku',
  templateUrl: './add-author-haiku.component.html',
  styleUrls: ['./add-author-haiku.component.css']
})
export class AddAuthorHaikuComponent implements OnInit, OnDestroy { 
  private unsubscribe$ = new Subject<void>();

  errorMessages: { add: string | null } = {
    add: null
  };

  loadingStates = {
    add: false
  };

  constructor(
    private authorHaikuService: AuthorHaikuService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.clearMessages();
  }

  /**
   * Clears any error messages related to add loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      add: null,
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., add loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'add'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'add'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
  }

  /**
   * Adds a new haiku for an author and navigates to the view page for the newly created haiku.
   * 
   * @param {AuthorHaikuDto} authorHaikuDto - The data transfer object containing the haiku details to be added.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  addAuthorHaiku(authorHaikuDto: AuthorHaikuDto): void {
    this.loadingStates.add = true;

    this.authorHaikuService.addAuthorHaiku(authorHaikuDto).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.add = false
      })
    ).subscribe({
      next: response => {
        this.router.navigate(['/view-author-haiku', response.id]);
      },
      error: error => this.handleError(error, 'add')
    });
  }
}
