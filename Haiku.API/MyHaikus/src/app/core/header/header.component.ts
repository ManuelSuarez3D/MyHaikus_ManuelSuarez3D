import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { LogoutService } from '../services/logout.service';
import { NavigationService } from '../services/navigation.service';

/**
 * Component representing the header of the application.
*/
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userId: number | null = null;

  constructor(
    private logoutService: LogoutService,
    private navigationService: NavigationService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  /**
   * Logs out the current user and navigates to the home page.
   *
   * @returns {void} This method does not return a value.
  */
  logout(): void {
    this.logoutService.logout();
    this.router.navigate(['/home']);
  }
}
