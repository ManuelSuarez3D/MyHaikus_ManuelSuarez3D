import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Service for handling navigation within the application.
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private router: Router,
  ) { }

  /**
   * Navigates to the login page.
   *
   * @returns {void} This method does not return a value.
   */
  viewLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navigates to the page displaying all authors.
   *
   * @returns {void} This method does not return a value.
  */
  viewAuthors(): void {
    this.router.navigate(['/all-authors']);
  }

  /**
   * Navigates to the detailed view of a specific author.
   *
   * @param {number} authorId - The ID of the author to view.
   * @returns {void} This method does not return a value.
  */
  viewAuthor(authorId: number): void {
    this.router.navigate(['/view-author', authorId]);
  }

  /**
   * Navigates to the update page for a specific author.
   *
   * @param {number} authorId - The ID of the author to update.
   * @returns {void} This method does not return a value.
  */
  updateAuthor(authorId: number): void {
    this.router.navigate(['/update-author', authorId]);
  }

  /**
   * Navigates to the page displaying all author haikus.
   *
   * @returns {void} This method does not return a value.
  */
  viewAuthorHaikus(): void {
    this.router.navigate(['/all-author-haikus']);
  }

  /**
   * Navigates to the detailed view of a specific author haiku.
   *
   * @param {number} authorHaikuId - The ID of the author haiku to view.
   * @returns {void} This method does not return a value.
  */
  viewAuthorHaiku(authorHaikuId: number): void {
    this.router.navigate(['/view-author-haiku', authorHaikuId]);
  }

  /**
   * Navigates to the update page for a specific author haiku.
   *
   * @param {number} authorHaikuId - The ID of the author haiku to update.
   * @returns {void} This method does not return a value.
  */
  updateAuthorHaiku(authorHaikuId: number): void {
    this.router.navigate(['/update-author-haiku', authorHaikuId]);
  }

  /**
   * Navigates to the page displaying all users.
   *
   * @returns {void} This method does not return a value.
  */
  viewUsers(): void {
    this.router.navigate(['/all-users']);
  }

  /**
   * Navigates to the detailed view of a specific user.
   *
   * @param {number} userId - The ID of the user to view.
   * @returns {void} This method does not return a value.
  */
  viewUser(userId: number): void {
    this.router.navigate(['/view-user', userId]);
  }

  /**
   * Navigates to the update page for a specific user.
   *
   * @param {number} userId - The ID of the user to update.
   * @returns {void} This method does not return a value.
  */
  updateUser(userId: number): void {
    this.router.navigate(['/update-user', userId]);
  }

  /**
   * Navigates to the update profile page for the current user.
   *
   * @returns {void} This method does not return a value.
  */
  updateUserOrProfile(): void {
    this.router.navigate(['/update-profile']);
  }

  /**
   * Navigates to the page displaying all user haikus.
   *
   * @returns {void} This method does not return a value.
  */
  viewUserHaikus(): void {
    this.router.navigate(['/all-user-haikus']);
  }

  /**
   * Navigates to the detailed view of a specific user haiku.
   *
   * @param {number} userHaikuId - The ID of the user haiku to view.
   * @returns {void} This method does not return a value.
  */
  viewUserHaiku(userHaikuId: number): void {
    this.router.navigate(['/view-user-haiku', userHaikuId]);
  }

  /**
   * Navigates to the update page for a specific user haiku.
   *
   * @param {number} userHaikuId - The ID of the user haiku to update.
   * @returns {void} This method does not return a value.
  */
  updateUserHaiku(userHaikuId: number): void {
    this.router.navigate(['/update-user-haiku', userHaikuId]);
  }

}
