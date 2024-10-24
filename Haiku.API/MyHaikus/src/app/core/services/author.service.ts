import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ErrorHandlingService } from '../utilities/error-handling.service';
import { XmlSerializerService } from '../utilities/xml-serializer.service';
import { AuthorDto } from '../../shared/models/authorDto.model';
import { PaginationMetaDataDto } from '../../shared/models/paginationMetaDataDto.model';

/**
 * Service for managing authors, providing methods to retrieve, add, update, and delete author data.
*/
@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private authorApi = 'author';

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
   * Constructs the URL for author-related API endpoints.
   *
   * @private
   * @param {string} endpoint - The specific API endpoint to append to the base URL.
   * @returns {string} - The complete URL for the author API.
  */
  private authorUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}/${this.authorApi}/${endpoint}`;
  }

  /**
   * Retrieves a paginated list of authors.
   *
   * @param {number} [currentPage=1] - The current page number for pagination.
   * @param {number} [pageSize=10] - The number of authors to retrieve per page.
   * @param {string} [searchOption=''] - An optional search term to filter authors.
   * @returns {Observable<{ authors: AuthorDto[]; paginationMetadata: PaginationMetaDataDto }>} - An observable containing the authors and pagination metadata.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAllAuthors(
    currentPage: number = 1,
    pageSize: number = 10,
    searchOption: string = ''
  ): Observable<{ authors: AuthorDto[]; paginationMetadata: PaginationMetaDataDto }> {
    const url = this.authorUrl(`?currentPage=${currentPage}&pageSize=${pageSize}&searchOption=${encodeURIComponent(searchOption)}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json', observe: 'response' })
      .pipe(
        map(response => {
          const authors = this.xmlSerializer.deserializeArray<AuthorDto>(response.body || '', 'AuthorDto') || [];
          const paginationData = response.headers.get('x-pagination') ? this.xmlSerializer.deserializePaginationMetaData(response.headers.get('x-pagination')!) : { totalCount: 0, totalPages: 1 };
          return { authors, paginationMetadata: { ...paginationData, pageSize, currentPage } };
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching Authors'))
      );
  }

  /**
   * Fetches an author by their ID.
   *
   * @param {number} authorId - The ID of the author to retrieve.
   * @returns {Observable<AuthorDto>} - An observable containing the author data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAuthorById(authorId: number): Observable<AuthorDto> {
    const url = this.authorUrl(`${authorId}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<AuthorDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching Author'))
      );
  }

  /**
   * Adds a new author to the system.
   *
   * @param {AuthorDto} newAuthorDto - The data transfer object for the new author.
   * @returns {Observable<AuthorDto>} - An observable containing the added author data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public addAuthor(newAuthorDto: AuthorDto): Observable<AuthorDto> {
    const url = this.authorUrl(``);

    return this.http.post<string>(url, this.xmlSerializer.serialize(newAuthorDto, 'AuthorDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<AuthorDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'adding Author'))
      );
  }

  /**
   * Updates an existing author's information.
   *
   * @param {number} authorId - The ID of the author to update.
   * @param {AuthorDto} updatedAuthorDto - The updated data transfer object for the author.
   * @returns {Observable<void>} - An observable that completes when the update is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public updateAuthor(authorId: number, updatedAuthorDto: AuthorDto): Observable<void> {
    const url = this.authorUrl(`${authorId}`);

    return this.http.put<void>(url, this.xmlSerializer.serialize(updatedAuthorDto, 'AuthorDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'updating Author'))
      );
  }

  /**
   * Deletes an author by their ID.
   *
   * @param {number} authorId - The ID of the author to delete.
   * @returns {Observable<void>} - An observable that completes when the deletion is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public deleteAuthor(authorId: number): Observable<void> {
    const url = this.authorUrl(`${authorId}`);
    return this.http.delete<void>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'deleting Author'))
      );
  }
}
