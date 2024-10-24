import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Guard that prevents authenticated users from accessing certain routes.
*/
@Injectable({
  providedIn: 'root',
})
export class UnAuthenticatedGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  /**
   * Determines if the route can be activated based on the user's authentication status.
   * If the user is authenticated, they will be redirected, and access will be blocked.
   *
   * @returns {boolean} False if the user is authenticated; otherwise, true.
   */
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
