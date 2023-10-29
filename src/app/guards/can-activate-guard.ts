import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        const isLoginRoute = state.url.includes('login');
        if (isLoggedIn && isLoginRoute || !isLoggedIn && !isLoginRoute) {
          this.router.navigate([isLoggedIn ? '/dashboard' : '/login']);
          return false;
        }
        return true;
      })
    );
  }
}
