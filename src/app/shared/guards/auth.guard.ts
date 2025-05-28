import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, createUrlTreeFromSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  
  constructor(
      private authService: AuthService
    ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.authService.isLoggedInSnapshot) return true;

    return createUrlTreeFromSnapshot(route, ['/']);
  }

}