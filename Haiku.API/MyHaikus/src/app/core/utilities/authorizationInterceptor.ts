import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor(private authService: AuthorizationService) { }

  /**
   * Intercepts HTTP requests and adds an authorization token to the headers
   * for specific HTTP methods (POST, PUT, DELETE).
   * 
   * @param {HttpRequest<any>} req - The outgoing HTTP request to be intercepted.
   * @param {HttpHandler} next - The next handler in the chain of HTTP requests.
   * @returns {Observable<HttpEvent<any>>} - An observable of the HTTP event.
  */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const methodsToIntercept = ['POST', 'PUT', 'DELETE'];

    if (methodsToIntercept.includes(req.method)) {
      if (token) {
        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(clonedRequest);
      }
    }

    return next.handle(req);
  }
}
