import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { BehaviorSubject, Observable } from "rxjs";

/**
 * Service for managing user authentication state.
*/
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private cookieService: CookieService,
  ) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Updates the authentication state by emitting the new authentication status.
   *
   * @param {boolean} isAuthenticated - Indicates whether the user is authenticated.
   * @returns {void} This method does not return a value.
  */
  public updateAuthenticationState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  /**
   * Checks whether the user is authenticated based on the validity of the token.
   *
   * @returns {boolean} - Returns `true` if the token is valid, otherwise `false`.
  */
  public isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  /**
   * Determines if the stored token is valid.
   *
   * @returns {boolean} - Returns `true` if the token exists and is not expired, otherwise `false`.
  */
  public isTokenValid(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); 
  }

  /**
   * Retrieves the JWT token from cookies.
   *
   * @returns {string | null} - The JWT token if it exists, otherwise `null`.
  */
  public getToken(): string | null {
    return this.cookieService.get('jwtToken');
  }

  /**
   * Checks if the provided token is expired.
   *
   * @private
   * @param {string} token - The JWT token to check for expiration.
   * @returns {boolean} - Returns `true` if the token is expired, otherwise `false`.
  */
  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  }

  /**
   * Decodes a JWT token to extract its payload.
   *
   * @private
   * @param {string} token - The JWT token to decode.
   * @returns {any} - The decoded payload, or `null` if decoding fails.
  */
  private decodeToken(token: string): any {
    try {
      const decodedToken = jwt_decode<JwtPayload>(token)
      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  /**
   * Retrieves the user ID from the JWT token's payload.
   *
   * @returns {number | null} - The user ID if it exists in the token, otherwise `null`.
  */
  public getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeToken(token);

      return payload ? parseInt(payload['nameid'], 10) || null : null;
    }
    return null;
  }
}
