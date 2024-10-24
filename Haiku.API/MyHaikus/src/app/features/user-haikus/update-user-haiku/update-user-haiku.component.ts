import { Component, Output, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subject, takeUntil, finalize } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { UserHaikuService } from "../../../core/services/user-haiku.service";
import { UserService } from "../../../core/services/user.service";
import { UserHaikuDto } from "../../../shared/models/userHaikuDto.model";

/**
 * A component for updating a user haiku for a user.
*/
@Component({
  selector: 'app-update-userHaiku',
  templateUrl: './update-user-haiku.component.html',
  styleUrls: ['./update-user-haiku.component.css']
})
export class UpdateUserHaikuComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  userHaikuDto: UserHaikuDto = { id: 0, title: '', lineOne: '', lineTwo: '', lineThree: '', userId: 0 };

  errorMessages = {
    update: null,
  };

  loadingStates = {
    update: false,
  };

  constructor(
    private userHaikuService: UserHaikuService,
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

    const userHaikuIdToUpdate = +this.route.snapshot.paramMap.get('id')!;
    this.loadUserHaikuById(userHaikuIdToUpdate);
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
   * Loads the specific user haiku by the ID and assigns it to the component's `userHaikuDto`.
   * 
   * @param {number} userHaikuId - The ID of the user haiku to load.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadUserHaikuById(userHaikuId: number): void {
    this.loadingStates.update = true;

    this.userHaikuService.getUserHaikuById(userHaikuId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.update = false;
      })
    ).subscribe({
      next: userHaiku => {
        this.userHaikuDto = userHaiku;
      },
      error: error => this.handleError(error, 'update')
    });
  }

  /**
   * Updates an existing user haiku and navigates to the user haiku view page.
   * 
   * @param {UserHaikuDto} updatedUserHaiku - The data transfer object containing the updated user haiku details.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  updateUserHaiku(updatedUserHaiku: UserHaikuDto): void {
    this.loadingStates.update = true;

    this.userHaikuService.updateUserHaiku(updatedUserHaiku.id, updatedUserHaiku).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.update = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/view-user-haiku', updatedUserHaiku.id]);
      },
      error: error => this.handleError(error, 'update')
    });
  }
}
