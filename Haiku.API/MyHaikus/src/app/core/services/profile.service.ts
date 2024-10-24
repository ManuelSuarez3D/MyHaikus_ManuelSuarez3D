import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ErrorHandlingService } from '../utilities/error-handling.service';
import { XmlSerializerService } from '../utilities/xml-serializer.service';
import { ProfileDto } from '../../shared/models/profileDto.model';

/**
 * Service for managing profiles, providing methods to retrieve, add, and update profile data.
*/
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileApi = 'profile';

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
   * Constructs the URL for profile-related API endpoints.
   *
   * @private
   * @param {string} endpoint - The specific API endpoint to append to the base URL.
   * @returns {string} - The complete URL for the profile API.
  */
  private profileUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}/${this.profileApi}/${endpoint}`;
  }

  /**
   * Fetches a profile by their ID.
   *
   * @param {number} profileId - The ID of the profile to retrieve.
   * @returns {Observable<AuthorDto>} - An observable containing the profile data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getProfileById(profileId: number): Observable<ProfileDto> {
    const url = this.profileUrl(`${profileId}`);
    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => this.xmlSerializer.deserialize<ProfileDto>(responseXml)),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching Profile'))
      );
  }

  /**
   * Retrieves a list of profiles by user IDs.
   *
   * @param {number[]} [userIds] - The IDs of the users.
   * @returns {Observable<{ profiles: ProfileDto[] }>} - An observable containing the user profiles.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getAllProfilesByUserIds(userIds: number[]): Observable<{ profiles: ProfileDto[] }> {
    const userIdsQuery = userIds.join('&userIds=');
    const url = this.profileUrl(`profiles-by-ids?userIds=${userIdsQuery}`);

    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json', observe: 'response' })
      .pipe(
        map(response => {
          const profiles = this.xmlSerializer.deserializeArray<ProfileDto>(response.body || '', 'ProfileDto') || [];
          return { profiles };
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching User Profiles'))
      );
  }

  /**
   * Fetches an author by their ID.
   *
   * @param {number} userId - The ID of the user profile to retrieve.
   * @returns {Observable<ProfileDto>} - An observable containing the profile data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getProfileByUserId(userId: number): Observable<ProfileDto> {
    const url = this.profileUrl(`user/${userId}`);
    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => this.xmlSerializer.deserialize<ProfileDto>(responseXml)),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching Profile'))
      );
  }

  /**
   * Updates an existing profile's information.
   *
   * @param {number} profileId - The ID of the profile to update.
   * @param {ProfileDto} updatedProfileDto - The updated data transfer object for the profile.
   * @returns {Observable<void>} - An observable that completes when the update is successful.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public updateProfile(profileId: number, updatedProfileDto: ProfileDto): Observable<void> {
    const url = this.profileUrl(`${profileId}`);
    return this.http.put<void>(url, this.xmlSerializer.serialize(updatedProfileDto, 'ProfileDto'), { headers: this.getHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'updating Profile'))
      );
  }
}
