import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { AuthorizationService } from '../../core/services/authorization.service';

@Directive({
  selector: '[appIsAuthorized]'
})
export class IsAuthorizedDirective implements OnInit, OnDestroy {
  private authSubscription$: Subscription | null = null;
  @Input() appIsAuthorized: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService,
  ) { }

  ngOnInit() {
    this.authSubscription$ = this.authorizationService.isAuthorized$
      .subscribe(() => this.updateView());
  }

  ngOnDestroy() {
    if (this.authSubscription$) this.authSubscription$.unsubscribe();
  }

  /**
   * Updates the view based user's authorized status for the specified roles.
   *
   * @returns {void} This method does not return a value.
  */
  private updateView() {
    if (this.authorizationService.isAuthorizedForRoles(this.appIsAuthorized)) {
      // User is authorized, display the view
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // User is not authorized, clear the view
      this.viewContainer.clear();
    }
  }
}
