import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { finalize, Subject, takeUntil } from "rxjs";
import { OnInit } from "@angular/core";
import { UserHaikuService } from "../../../core/services/user-haiku.service";
import { UserHaikuDto } from "../../../shared/models/userHaikuDto.model";

/**
 * A component for adding a user haiku for an user.
*/
@Component({
  selector: 'app-add-user-haiku',
  templateUrl: './add-user-haiku.component.html',
  styleUrls: ['./add-user-haiku.component.css']
})
export class AddUserHaikuComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  errorMessages: { add: string | null } = {
    add: null
  };

  loadingStates = {
    add: false
  };

  constructor(
    private userHaikuService: UserHaikuService,
    private router: Router
  ) {
  }

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
   * Adds an user haiku and navigates to the view page for the newly created user haiku.
   * 
   * @param {UserHaikuDto} userHaikuDto - The data transfer object containing the user haiku details to be added.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  addUserHaiku(userHaikuDto: UserHaikuDto): void {
    this.loadingStates.add = true;
   
    this.userHaikuService.addUserHaiku(userHaikuDto).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.add = false
      })
    ).subscribe({
      next: response => {
        this.router.navigate(['/view-user-haiku', response.id]);
      },
      error: error => this.handleError(error, 'add')
    });
  }
}
