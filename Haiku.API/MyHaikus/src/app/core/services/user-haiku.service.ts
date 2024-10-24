import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserHaikuDto } from '../../shared/models/userHaikuDto.model';
import { environment } from '../../../environments/environment.development';
import { ErrorHandlingService } from '../utilities/error-handling.service';
import { XmlSerializerService } from '../utilities/xml-serializer.service';
import { PaginationMetaDataDto } from '../../shared/models/paginationMetaDataDto.model';

/**
 * Service for managing user haikus, providing methods to retrieve, add, update, and delete user haiku data.
 */
@Injectable({
  providedIn: 'root',
})
export class UserHaikuService {
  private userUserHaikuApi = 'userHaiku';

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
   * Constructs the URL for user-haiku-related API endpoints.
   *
   * @private
   * @param {string} endpoint - The specific API endpoint to append to the base URL.
   * @returns {string} - The complete URL for the author API.
  */
  private userHaikuUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}/${this.userUserHaikuApi}/${endpoint}`;
  }

  /**
   * Retrieves a paginated list of user haikus.
   *
   * @param {number} [currentPage=1] - The current page number for pagination.
   * @param {number} [pageSize=10] - The number of user haikus to retrieve per page.
   * @param {string} [searchOption=''] - An optional search term to filter user haikus.
   * @returns {Observable<{ userHaikus: UserHaikuDto[]; paginationMetadata: PaginationMetaDataDto }>} - An observable containing the author haikus and pagination metadata.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAllUserHaikus(
    currentPage: number = 1,
    pageSize: number = 10,
    searchOption: string = ''
  ): Observable<{ userHaikus: UserHaikuDto[]; paginationMetadata: PaginationMetaDataDto }> {
    const url = this.userHaikuUrl(`?currentPage=${currentPage}&pageSize=${pageSize}&searchOption=${encodeURIComponent(searchOption)}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json', observe: 'response' })
      .pipe(
        map(response => {
          const userHaikus = this.xmlSerializer.deserializeArray<UserHaikuDto>(response.body || '', 'UserHaikuDto') || [];
          const paginationData = response.headers.get('x-pagination') ? this.xmlSerializer.deserializePaginationMetaData(response.headers.get('x-pagination')!) : { totalCount: 0, totalPages: 1 };
          return { userHaikus, paginationMetadata: { ...paginationData, pageSize, currentPage } };
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching UserHaikus'))
      );
  }

  /**
   * Retrieves a paginated list of user haikus by author ID.
   *
   * @param {number} [userId] - The ID of the author.
   * @param {number} [currentPage=1] - The current page number for pagination.
   * @param {number} [pageSize=10] - The number of author haikus to retrieve per page.
   * @param {string} [searchOption=''] - An optional search term to filter user haikus.
   * @returns {Observable<{ userHaikus: UserHaikuDto[]; paginationMetadata: PaginationMetaDataDto }>} - An observable containing the author haikus and pagination metadata.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAllUserHaikusByUserId(
    userId: number,
    currentPage: number = 1,
    pageSize: number = 10,
    searchOption: string = ''
  ): Observable<{ userHaikus: UserHaikuDto[]; paginationMetadata: PaginationMetaDataDto }> {
    const url = this.userHaikuUrl(`user/${userId}?currentPage=${currentPage}&pageSize=${pageSize}&searchOption=${encodeURIComponent(searchOption)}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json', observe: 'response' })
      .pipe(
        map(response => {
          const userHaikus = this.xmlSerializer.deserializeArray<UserHaikuDto>(response.body || '', 'UserHaikuDto') || [];
          const paginationData = response.headers.get('x-pagination') ? this.xmlSerializer.deserializePaginationMetaData(response.headers.get('x-pagination')!) : { totalCount: 0, totalPages: 1 };
          return { userHaikus, paginationMetadata: { ...paginationData, pageSize, currentPage } };
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching UserHaikus by User'))
      );
  }

  /**
   * Fetches an user haiku by their ID.
   *
   * @param {number} authoruserHaikuIdHaikuId - The ID of the user haiku to retrieve.
   * @returns {Observable<UserHaikuDto>} - An observable containing the user haiku data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getUserHaikuById(userHaikuId: number): Observable<UserHaikuDto> {
    const url = this.userHaikuUrl(`${userHaikuId}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<UserHaikuDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching UserHaiku'))
      );
  }

  /**
   * Adds a new user haiku to the system.
   *
   * @param {UserHaikuDto} newUserHaikuDto - The data transfer object for the new user haiku.
   * @returns {Observable<UserHaikuDto>} - An observable containing the added user haiku data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public addUserHaiku(newUserHaikuDto: UserHaikuDto): Observable<UserHaikuDto> {
    const url = this.userHaikuUrl(``);

    return this.http.post<string>(url, this.xmlSerializer.serialize(newUserHaikuDto, 'UserHaikuDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<UserHaikuDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'adding UserHaiku'))
      );
  }

  /**
   * Updates an existing user haiku's information.
   *
   * @param {number} userHaikuId - The ID of the user haiku to update.
   * @param {UserHaikuDto} updatedUserHaikuDto - The updated data transfer object for the user haiku.
   * @returns {Observable<void>} - An observable that completes when the update is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public updateUserHaiku(userHaikuId: number, updatedUserHaikuDto: UserHaikuDto): Observable<void> {
    const url = this.userHaikuUrl(`${userHaikuId}`);

    return this.http.put<void>(url, this.xmlSerializer.serialize(updatedUserHaikuDto, 'UserHaikuDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'updating UserHaiku'))
      );
  }

  /**
   * Deletes an user haiku by their ID.
   *
   * @param {number} userHaikuId - The ID of the user haiku to delete.
   * @returns {Observable<void>} - An observable that completes when the deletion is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public deleteUserHaiku(userHaikuId: number): Observable<void> {
    const url = this.userHaikuUrl(`${userHaikuId}`);

    return this.http.delete<void>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'deleting UserHaiku'))
      );
  }
}
