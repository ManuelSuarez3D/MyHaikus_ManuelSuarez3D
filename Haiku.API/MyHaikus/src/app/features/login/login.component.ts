import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LoginService } from '../../core/services/login.service';
import { LoginDto } from '../../shared/models/loginDto.model';

/**
 * Component for handling user login.
*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  private unsubscribe$ = new Subject<void>();

  loginDto: LoginDto = { username: '', password: '' };

  successMessages = {
    login: ""
  };

  errorMessages: { login: string | null } = {
    login: null,
  };

  loadingStates = {
    login: false,
  };

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.clearMessages();
  }

  /**
   * Clears any error messages related to login loading.
  */
  private clearMessages(): void {
    this.errorMessages = {
      login: null,
    };
    this.successMessages = {
      login: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., login loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'login'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'login'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
  }

  /**
   * Authenticates the user and navigates to the home page upon successful login.
   *
   * @param {LoginDto} loginDto - An object containing the username and password for authentication.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  login(loginDto: LoginDto): void {
    this.loadingStates.login = true;

    this.loginDto.username = loginDto.username;
    this.loginDto.password = loginDto.password;

    this.loginService.login(this.loginDto).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.login = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: error => this.handleError(error, 'login')
    });
  }
}
