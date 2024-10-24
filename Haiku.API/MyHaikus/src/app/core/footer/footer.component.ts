import { Component, OnInit } from '@angular/core';

/**
 * Component representing the footer of the application.
*/
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor() { }

  /**
   * Scrolls the window to the top of the page.
   *
   * @returns {void} This method does not return a value.
  */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}

