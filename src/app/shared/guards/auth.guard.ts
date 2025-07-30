import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, createUrlTreeFromSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LocationStrategy } from '@angular/common';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private locationStrategy: LocationStrategy
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.authService.authenticated()) return true;

    const redirectPath = window.location.origin + this.locationStrategy.prepareExternalUrl(state.url);
    return this.router.createUrlTree(['/auth'], { queryParams: { redirectToPath: redirectPath } });
  }

}
