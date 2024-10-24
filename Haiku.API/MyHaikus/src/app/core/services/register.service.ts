import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, map, catchError, of, firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { ErrorHandlingService } from "../utilities/error-handling.service";
import { XmlSerializerService } from "../utilities/xml-serializer.service";
import { RegisterDto } from "../../shared/models/registerDto.model";

/**
 * Service for managing registers, providing methods to add and verify register data.
*/
@Injectable({
  providedIn: 'root'
})

export class RegisterService {
  private registerApi = 'register';
  private userApi = 'user';

  constructor(
    private http: HttpClient,
    private xmlSerializer: XmlSerializerService,
    private errorHandler: ErrorHandlingService,
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
   * Constructs the URL for register-related API endpoints.
   *
   * @private
   * @param {string} endpoint - The specific API endpoint to append to the base URL.
   * @returns {string} - The complete URL for the author API.
  */
  private registerUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}/${this.registerApi}/${endpoint}`;
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
   * Adds a new register to the system.
   *
   * @param {RegisterDto} newRegisterDto - The data transfer object for the new register.
   * @returns {Observable<RegisterDto>} - An observable containing the added register data.
   *
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
  */
  public addRegister(newRegisterDto: RegisterDto): Observable<RegisterDto> {
    const url = this.registerUrl('');

    return this.http.post<string>(url, this.xmlSerializer.serialize(newRegisterDto, 'RegisterDto'), { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => { return this.xmlSerializer.deserialize<RegisterDto>(responseXml) }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'adding Register'))
      );
  }
}
