import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ErrorHandlingService } from '../utilities/error-handling.service';
import { XmlSerializerService } from '../utilities/xml-serializer.service';
import { ImageDto } from '../../shared/models/imageDto';

/**
 * Service for managing images, providing methods to retrieve, add, and update image data.
*/
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imageApi = 'image';

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
   * Constructs the URL for image-related API endpoints.
   *
   * @private
   * @param {string} endpoint - The specific API endpoint to append to the base URL.
   * @returns {string} - The complete URL for the image API.
  */
  private imageUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}/${this.imageApi}/${endpoint}`;
  }

  /**
   * Fetches a image by their ID.
   *
   * @param {number} imageId - The ID of the image to retrieve.
   * @returns {Observable<AuthorDto>} - An observable containing the image data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public getImageById(imageId: number): Observable<ImageDto> {
    const url = this.imageUrl(`${imageId}`);
    return this.http.get<string>(url, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => {
          const imageDto = this.xmlSerializer.deserialize<ImageDto>(responseXml);
          return imageDto;
        }),
        catchError((error: HttpErrorResponse) => {
          return this.errorHandler.handleError(error, 'fetching image');
        })
      );
  }

  /**
   * Uploads an image to the server and associates it with the current user and image ID.
   *
   * @param {File} selectedFile - The image file to be uploaded.
   * @param {number} currentImageId - The ID of the current image associated with the user.
   * @param {number} currentUserId - The ID of the user uploading the image.
   * @returns {Observable<void>} An observable that completes upon successful upload.
   * 
   * @throws {HttpErrorResponse} If the HTTP request fails.
   * @throws {Error} If no file is provided for upload.
   */
  public uploadImage(selectedFile: File, currentImageId: number, currentUserId: number): Observable<void> {
    if (selectedFile) {
      const url = this.imageUrl(`upload-image/${currentImageId}/${currentUserId}`);
      const formData = new FormData();
      formData.append('file', selectedFile, selectedFile.name);

      return this.http.post<void>(url, formData)
        .pipe(
          catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'uploading Image'))
        );
    }

    return throwError('No file provided');
  }
}
