import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {
    const token = this.authService.getToken();
    const username = this.authService.getUsername();

    if (token && username) {
      return this.authService.checkToken(token, username).pipe(
        map(isValid => isValid ? true : this.router.createUrlTree(['/login'])),
        catchError(() => of(this.router.createUrlTree(['/login'])))
      );
    }

    return of(this.router.createUrlTree(['/login']));
  }
}