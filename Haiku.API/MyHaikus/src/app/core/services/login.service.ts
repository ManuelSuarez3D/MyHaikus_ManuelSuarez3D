import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { UserDto } from "../../shared/models/userDto.model";
import { Observable, map, catchError } from "rxjs";
import { JWTokenDto } from "../../shared/models/jwtokenDto.model";
import { AuthenticationService } from "./authentication.service";
import { AuthorizationService } from "./authorization.service";
import { environment } from "../../../environments/environment.development";
import { ErrorHandlingService } from "../utilities/error-handling.service";
import { XmlSerializerService } from "../utilities/xml-serializer.service";
import { LoginDto } from "../../shared/models/loginDto.model";

/**
 * Service for handling user login operations.
*/
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginApi = 'login'; 
  private readonly DefaultRoles = ['Admin', 'User'];
  constructor(
    private http: HttpClient,
    private xmlSerializer: XmlSerializerService,
    private cookieService: CookieService,
    private errorHandler: ErrorHandlingService,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService 
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
   * Logs in a user and retrieves a JWT token.
   *
   * @param {LoginDto} loginDto - The data transfer object containing login credentials (username and password).
   * @returns {Observable<JWTokenDto>} - An observable that emits the JWT token data upon successful login.
   * 
   * @throws {HttpErrorResponse} - Throws an error if the request fails.
   */
  public login(loginDto: LoginDto): Observable<JWTokenDto> {
    const xmlUserDto = this.xmlSerializer.serialize(loginDto, 'LoginDto');

    return this.http.post<string>(`${environment.apiBaseUrl}/${this.loginApi}`, xmlUserDto, { headers: this.getHeaders(), responseType: 'text' as 'json' })
      .pipe(
        map(responseXml => {
          const jwtDto = this.xmlSerializer.deserialize<JWTokenDto>(responseXml);

          this.cookieService.set('jwtToken', jwtDto.token, {
            expires: 1,
            secure: true,
            sameSite: 'Strict'
          });

          if (this.authenticationService.isAuthenticated()) 
            this.authenticationService.updateAuthenticationState(true);

          if (this.authorizationService.isAuthorizedForRoles(this.DefaultRoles)) 
            this.authorizationService.updateAuthorizedState(true)

          return jwtDto;
        }),
        catchError((error: HttpErrorResponse) => this.errorHandler.handleError(error, 'fetching Login'))
      );
  }
}
