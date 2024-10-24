import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthorHaikuDto } from '../../shared/models/authorHaikuDto.model';
import { environment } from '../../../environments/environment.development';
import { ErrorHandlingService } from '../utilities/error-handling.service';
import { XmlSerializerService } from '../utilities/xml-serializer.service';
import { PaginationMetaDataDto } from '../../shared/models/paginationMetaDataDto.model';
import { AuthorizationService } from './authorization.service';

/**
 * Service for managing author haikus, providing methods to retrieve, add, update, and delete author haiku data.
*/
@Injectable({
  providedIn: 'root',
})
export class AuthorHaikuService {
  private authorAuthorHaikuApi = 'authorHaiku';

  constructor(
    private http: HttpClient,
    private xmlSerializer: XmlSerializerService,
    private errorHandler: ErrorHandlingService,
    private authService: AuthorizationService
  ) { }

  /**
   * Generates HTTP headers for the requests.
   *
   * @private
   * @returns {HttpHeaders} - The headers with content type and accept type set to XML.
  */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    let headers = new HttpHeaders({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Constructs the URL for author-haiku-related API endpoints.
   *
   * @private
   * @param {string} endpoint - The specific API endpoint to append to the base URL.
   * @returns {string} - The complete URL for the author API.
  */
  private authorHaikuUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}/${this.authorAuthorHaikuApi}/${endpoint}`;
  }

  /**
   * Retrieves a paginated list of author haikus.
   *
   * @param {number} [currentPage=1] - The current page number for pagination.
   * @param {number} [pageSize=10] - The number of author haikus to retrieve per page.
   * @param {string} [searchOption=''] - An optional search term to filter author haikus.
   * @returns {Observable<{ authorHaikus: AuthorHaikuDto[]; paginationMetadata: PaginationMetaDataDto }>} - An observable containing the author haikus and pagination metadata.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAllAuthorHaikus(
    currentPage: number = 1,
    pageSize: number = 10,
    searchOption: string = ''
  ): Observable<{ authorHaikus: AuthorHaikuDto[]; paginationMetadata: PaginationMetaDataDto }> {
    const url = this.authorHaikuUrl(`?currentPage=${currentPage}&pageSize=${pageSize}&searchOption=${encodeURIComponent(searchOption)}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json', observe: 'response' })
      .pipe(
        map(response => {
          const authorHaikus = this.xmlSerializer.deserializeArray<AuthorHaikuDto>(response.body || '', 'AuthorHaikuDto') || [];
          const paginationData = response.headers.get('x-pagination') ? this.xmlSerializer.deserializePaginationMetaData(response.headers.get('x-pagination')!) : { totalCount: 0, totalPages: 1 };
          return { authorHaikus, paginationMetadata: { ...paginationData, pageSize, currentPage } };
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching AuthorHaikus'))
      );
  }

  /**
   * Retrieves a paginated list of author haikus by author ID.
   *
   * @param {number} [authorId] - The ID of the author.
   * @param {number} [currentPage=1] - The current page number for pagination.
   * @param {number} [pageSize=10] - The number of author haikus to retrieve per page.
   * @param {string} [searchOption=''] - An optional search term to filter authors haikus.
   * @returns {Observable<{ authorHaikus: AuthorHaikuDto[]; paginationMetadata: PaginationMetaDataDto }>} - An observable containing the author haikus and pagination metadata.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAllAuthorHaikusByAuthorId(
    authorId: number,
    currentPage: number = 1,
    pageSize: number = 10,
    searchOption: string = ''
  ): Observable<{ authorHaikus: AuthorHaikuDto[]; paginationMetadata: PaginationMetaDataDto }> {
    const url = this.authorHaikuUrl(`author/${authorId}?currentPage=${currentPage}&pageSize=${pageSize}&searchOption=${encodeURIComponent(searchOption)}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json', observe: 'response' })
      .pipe(
        map(response => {
          const authorHaikus = this.xmlSerializer.deserializeArray<AuthorHaikuDto>(response.body || '', 'AuthorHaikuDto') || [];
          const paginationData = response.headers.get('x-pagination') ? this.xmlSerializer.deserializePaginationMetaData(response.headers.get('x-pagination')!) : { totalCount: 0, totalPages: 1 };
          return { authorHaikus, paginationMetadata: { ...paginationData, pageSize, currentPage } };
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching AuthorHaikus by Author'))
      );
  }

  /**
   * Fetches an author haiku by their ID.
   *
   * @param {number} authorHaikuId - The ID of the author haiku to retrieve.
   * @returns {Observable<AuthorHaikuDto>} - An observable containing the author haiku data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAuthorHaikuById(authorHaikuId: number): Observable<AuthorHaikuDto> {
    const url = this.authorHaikuUrl(`${authorHaikuId}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<AuthorHaikuDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching AuthorHaiku'))
      );
  }

  /**
   * Adds a new author haiku to the system.
   *
   * @param {AuthorDto} newAuthorHaikuDto - The data transfer object for the new author haiku.
   * @returns {Observable<AuthorHaikuDto>} - An observable containing the added author haiku data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public addAuthorHaiku(newAuthorHaikuDto: AuthorHaikuDto): Observable<AuthorHaikuDto> {
    const url = this.authorHaikuUrl(``);

    return this.http.post<string>(url, this.xmlSerializer.serialize(newAuthorHaikuDto, 'AuthorHaikuDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<AuthorHaikuDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'adding AuthorHaiku'))
      );
  }

  /**
   * Updates an existing author haiku's information.
   *
   * @param {number} authorHaikuId - The ID of the author haiku to update.
   * @param {AuthorDto} updatedAuthorHaikuDto - The updated data transfer object for the author haiku.
   * @returns {Observable<void>} - An observable that completes when the update is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public updateAuthorHaiku(authorHaikuId: number, updatedAuthorHaikuDto: AuthorHaikuDto): Observable<void> {
    const url = this.authorHaikuUrl(`${authorHaikuId}`);

    return this.http.put<void>(url, this.xmlSerializer.serialize(updatedAuthorHaikuDto, 'AuthorHaikuDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'updating AuthorHaiku'))
      );
  }

  /**
   * Deletes an author haiku by their ID.
   *
   * @param {number} authorHaikuId - The ID of the author haiku to delete.
   * @returns {Observable<void>} - An observable that completes when the deletion is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public deleteAuthorHaiku(authorHaikuId: number): Observable<void> {
    const url = this.authorHaikuUrl(`${authorHaikuId}`);

    return this.http.delete<void>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'deleting AuthorHaiku'))
      );
  }
}
