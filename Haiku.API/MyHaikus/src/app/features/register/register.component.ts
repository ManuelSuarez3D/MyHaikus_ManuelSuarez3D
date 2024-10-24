import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { RegisterDto } from '../../shared/models/registerDto.model';
import { UserService } from '../../core/services/user.service';
import { UserDto } from '../../shared/models/userDto.model';
import { NavigationService } from '../../core/services/navigation.service';
import { RegisterService } from '../../core/services/register.service';
import { OnInit } from '@angular/core';

/**
 * Component for user registration.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy{ 
  private unsubscribe$ = new Subject<void>();

  userDto: UserDto = { id: 0, username: '', password: '', roleId: 0 };

  successMessages = {
    register: ""
  };

  errorMessages: { register: string | null } = {
    register: null,
  };

  loadingStates = {
    register: false
  };

  constructor(
    private registerService: RegisterService) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.clearMessages();
  }

  /**
   * Clears any error messages related to add loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      register: null,
    };
    this.successMessages = {
      register: ""
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., register loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'register'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'register'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
  }

  /**
   * Registers a new user with the provided registration data (`registerDto`).
   *
   * @param {RegisterDto} registerDto - The data transfer object containing user registration details.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
   */
  register(registerDto: RegisterDto): void {
    this.loadingStates.register = true;

    this.registerService.addRegister(registerDto).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.register = false;
      })
    ).subscribe({
      next: () => {
        this.successMessages.register = "Registered successfully!";
      },
      error: error => this.handleError(error, 'register')
    });
  }
}
