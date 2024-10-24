import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';

/**
 * Guard that checks if a user is authorized to access a route.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {

  constructor(
    private authzService: AuthorizationService,
    private router: Router
  ) { }

  /**
   * Determines if the route can be activated based on the user's authorization status.
   * 
   * @param {ActivatedRouteSnapshot} route - The activated route snapshot.
   * @returns {boolean} True if the user is authorized; otherwise, false.
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['requiredRole'] || [];

    if (this.authzService.isAuthorizedForRoles(requiredRoles)) {
      return true; 
    } else {
      this.router.navigate(['/home']); 
      return false; 
    }
  }
}
