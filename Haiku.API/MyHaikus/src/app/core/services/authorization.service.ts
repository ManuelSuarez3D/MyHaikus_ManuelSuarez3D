import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { BehaviorSubject, Observable } from "rxjs";

/**
 * Service for managing user authorization state.
*/
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private isAuthorizedSubject: BehaviorSubject<boolean>;
  public isAuthorized$: Observable<boolean>;

  constructor(private cookieService: CookieService) {
    this.isAuthorizedSubject = new BehaviorSubject<boolean>(this.isAuthorizedForRoles(['Admin', 'User']));
    this.isAuthorized$ = this.isAuthorizedSubject.asObservable();
  }

  /**
   * Updates the authorization state by emitting the new authorization status.
   *
   * @param {boolean} isAuthenticated - Indicates whether the user is authorized.
   * @returns {void} This method does not return a value.
  */
  public updateAuthorizedState(isAuthorized: boolean): void {
    this.isAuthorizedSubject.next(isAuthorized);
  }

  /**
   * Checks whether the user is authorized based on the validity of the token and the admin or user role.
   *
   * @returns {boolean} - Returns `true` if the token is valid and admin, otherwise `false`.
  */
  public isAuthorizedForRoles(requiredRoles: string[]): boolean {
    return this.isTokenValid() && this.hasRequiredRole(requiredRoles);
  }


  /**
   * Checks if the user has any of the required roles.
   *
   * @param {string[]} requiredRoles - An array of roles to check against.
   * @returns {boolean} - Returns `true` if the user has one of the required roles; otherwise, `false`.
  */
  private hasRequiredRole(requiredRoles: string[]): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    const userRole = payload && payload["role"];

    return requiredRoles.includes(userRole);
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
}
