import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ErrorHandlingService } from '../utilities/error-handling.service';
import { XmlSerializerService } from '../utilities/xml-serializer.service';
import { UserDto } from '../../shared/models/userDto.model';
import { PaginationMetaDataDto } from '../../shared/models/paginationMetaDataDto.model';

/**
 * Service for managing users, providing methods to retrieve, add, update, and delete user data.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApi = 'user';

  constructor(
    private http: HttpClient,
    private xmlSerializer: XmlSerializerService,
    private errorHandler: ErrorHandlingService
  ) { }

  /**
   * Generates HTTP headers for the requests.
   *
   * @private
   * @returns {HttpHeaders} - The headers with content type and accept type set to XML.
  */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/xml',
      Accept: 'application/xml',
    });
  }

  /**
   * Constructs the URL for user-related API endpoints.
   *
   * @private
   * @param {string} endpoint - The specific API endpoint to append to the base URL.
   * @returns {string} - The complete URL for the user API.
  */
  private userUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}/${this.userApi}/${endpoint}`;
  }

  /**
   * Retrieves a paginated list of users.
   *
   * @param {number} [currentPage=1] - The current page number for pagination.
   * @param {number} [pageSize=10] - The number of users to retrieve per page.
   * @param {string} [searchOption=''] - An optional search term to filter users.
   * @returns {Observable<{ users: UserDto[]; paginationMetadata: PaginationMetaDataDto }>} - An observable containing the users and pagination metadata.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAllUsers(
    currentPage: number = 1,
    pageSize: number = 10,
    searchOption: string = ''
  ): Observable<{ users: UserDto[]; paginationMetadata: PaginationMetaDataDto }> {
    const url = this.userUrl(`?currentPage=${currentPage}&pageSize=${pageSize}&searchOption=${encodeURIComponent(searchOption)}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json', observe: 'response' })
      .pipe(
        map(response => {
          const users = this.xmlSerializer.deserializeArray<UserDto>(response.body || '', 'UserDto') || [];
          const paginationData = response.headers.get('x-pagination') ? this.xmlSerializer.deserializePaginationMetaData(response.headers.get('x-pagination')!) : { totalCount: 0, totalPages: 1 };
          return { users, paginationMetadata: { ...paginationData, pageSize, currentPage } };
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching Users'))
      );
  }

  /**
   * Fetches an user by their ID.
   *
   * @param {number} userId - The ID of the user to retrieve.
   * @returns {Observable<UserDto>} - An observable containing the user data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getUserById(userId: number): Observable<UserDto> {
    const url = this.userUrl(`${userId}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<UserDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching User'))
      );
  }

  /**
   * Adds a new user to the system.
   *
   * @param {UserDto} newUserDto - The data transfer object for the new user.
   * @returns {Observable<UserDto>} - An observable containing the added user data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public addUser(newUserDto: UserDto): Observable<UserDto> {
    const url = this.userUrl(``);

    return this.http.post<string>(url, this.xmlSerializer.serialize(newUserDto, 'UserDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<UserDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'adding User'))
      );
  }

  /**
   * Updates an existing user's information.
   *
   * @param {number} userId - The ID of the user to update.
   * @param {UserDto} updatedUserDto - The updated data transfer object for the user.
   * @returns {Observable<void>} - An observable that completes when the update is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public updateUser(userId: number, updatedUserDto: UserDto): Observable<void> {
    const url = this.userUrl(`${userId}`);

    return this.http.put<void>(url, this.xmlSerializer.serialize(updatedUserDto, 'UserDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'updating User'))
      );
  }

  /**
   * Deletes an user by their ID.
   *
   * @param {number} userId - The ID of the user to delete.
   * @returns {Observable<void>} - An observable that completes when the deletion is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public deleteUser(userId: number): Observable<void> {
    const url = this.userUrl(`${userId}`);

    return this.http.delete<void>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'deleting User'))
      );
  }

  /**
   * Verifies if a username is available for registration or updating.
   *
   * @param {string} username - The username to be verified.
   * @returns {Observable<boolean>} An observable that emits `true` if the username is available, or `false` otherwise.
   * 
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public verifyUsername(username: string): Observable<boolean> {
    const url = this.userUrl(`verify-username/${username}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserializeBoolean<boolean>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'verifying Username'))
      );
  }
}
