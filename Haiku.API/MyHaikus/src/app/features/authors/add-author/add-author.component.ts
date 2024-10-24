import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { finalize, Subject, takeUntil } from "rxjs";
import { AuthorService } from "../../../core/services/author.service";
import { AuthorDto } from "../../../shared/models/authorDto.model";
import { OnInit } from "@angular/core";

/**
 * A component for adding an author.
*/
@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css']
})
export class AddAuthorComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  errorMessages: { add: string | null } = {
    add: null,
  };

  loadingStates = {
    add: false,
  };

  constructor(
    private authorService: AuthorService,
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
   * Adds an author and navigates to the view page for the newly created author.
   * 
   * @param {AuthorDto} authorDto - The data transfer object containing the author details to be added.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  addAuthor(authorDto: AuthorDto): void {
    this.loadingStates.add = true;

    this.authorService.addAuthor(authorDto).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.add = false
      })
    ).subscribe({
      next: (response) => {
        this.router.navigate(['/view-author', response.id]);
      },
      error: error => this.handleError(error, 'add')
    });
  }
}
