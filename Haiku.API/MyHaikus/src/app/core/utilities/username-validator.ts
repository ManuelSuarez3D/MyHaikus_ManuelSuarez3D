import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';

/**
 * A validator service for checking the existence of usernames.
*/
@Injectable({ providedIn: 'root' })
export class UsernameValidator {
  constructor(private userService: UserService) { }

  /**
   * Creates an asynchronous validator function that checks if a username exists.
   * 
   * @returns {AsyncValidatorFn} An asynchronous validator function that checks the username's existence.
   */
  usernameTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      return this.userService.verifyUsername(control.value).pipe(
        map(exists => (exists ? { usernameExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
