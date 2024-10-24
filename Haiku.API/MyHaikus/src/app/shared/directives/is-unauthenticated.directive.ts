import { Directive, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../core/services/authentication.service';

/**
 * A directive that conditionally displays an element based on the user's authentication status.
 */
@Directive({
  selector: '[appIsUnAuthenticated]'
})
export class IsUnAuthenticatedDirective implements OnInit, OnDestroy {
  private authSubscription$: Subscription | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authSubscription$ = this.authenticationService.isAuthenticated$
      .subscribe(isAuthenticated => this.updateView(isAuthenticated));
  }

  ngOnDestroy(): void {
    if (this.authSubscription$) {
      this.authSubscription$.unsubscribe();
    }
  }

  /**
   * Updates the view based on the user's authentication status.
   *
   * @param {boolean} isAuthenticated - Indicates whether the user is authenticated.
   * @returns {void} This method does not return a value.
   */
  private updateView(isAuthenticated: boolean): void {
    if (!isAuthenticated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
