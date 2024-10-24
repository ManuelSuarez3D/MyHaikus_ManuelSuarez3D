import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Service for handling errors in HTTP operations and serialization processes.
*/
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  /**
   * Handles an HTTP error response and logs it to the console.
   * 
   * @param {HttpErrorResponse} error - The error response to handle.
   * @param {string} [operation='operation'] - The name of the operation that failed, used for logging.
   * @returns {Observable<never>} An observable that emits an error.
  */
  handleError(error: HttpErrorResponse, operation = 'operation'): Observable<never> {
    const errorMessage = this.constructErrorMessage(error);
    console.error(`Error in ${operation}:`, errorMessage);

    return throwError(() => new Error(this.getUserFriendlyErrorMessage(error)));
  }

  /**
   * Constructs a detailed error message based on the HTTP error response.
   * 
   * @param {HttpErrorResponse} error - The error response from the HTTP operation.
   * @returns {string} A detailed error message.
  */
  private constructErrorMessage(error: HttpErrorResponse): string {
    return error.error instanceof ErrorEvent
      ? `Client-side error: ${error.error.message}`
      : `Server-side error: ${error.status} - ${error.message}`;
  }

  /**
   * Generates a user-friendly error message based on the HTTP status code.
   * 
   * @param {HttpErrorResponse} error - The error response from the HTTP operation.
   * @returns {string} A user-friendly error message.
  */
  private getUserFriendlyErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Unauthorized access. Please log in or provide valid credentials.';
      case 403:
        return 'Forbidden access. You do not have the necessary permissions.';
      case 404:
        return 'Requested resource not found.';
      case 409:
        return 'Conflict. Please provide valid input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unknown error occurred.';
    }
  }

  /**
   * Handles serialization errors and logs them to the console.
   * 
   * @param {Error} error - The serialization error to handle.
   * @returns {Observable<never>} An observable that emits an error.
  */
  handleSerializationError(error: Error): Observable<never> {
    console.error(`Serialization error: ${error.message}`);
    const userFriendlyMessage = 'An error occurred during serialization. Please try again.';
    return throwError(() => new Error(userFriendlyMessage));
  }
}
