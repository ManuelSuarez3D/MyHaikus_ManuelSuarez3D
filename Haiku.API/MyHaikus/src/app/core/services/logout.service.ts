import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthorizationService } from './authorization.service';

/**
 * Service for handling user logout operations.
*/
@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService
  ) { }

  /**
   * Logs out the current user by deleting the JWT token from cookies 
   * and updating the authentication and authorization states.
   *
   * @returns {void} This method does not return a value.
  */
  logout(): void {
    this.cookieService.delete('jwtToken');

    this.authenticationService.updateAuthenticationState(false);
    this.authorizationService.updateAuthorizedState(false);

    this.router.navigate(['/login']);
  }
}
