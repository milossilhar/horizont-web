import { ActivatedRouteSnapshot, CanActivate, createUrlTreeFromSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, forkJoin, map, of, concatMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { EnumerationService } from '../service/enumeration.service';
import { AuthService } from '../service/auth.service';
import { RedirectService } from '../service/redirect.service';

@Injectable({providedIn: 'root'})
export class InitGuard implements CanActivate {

  constructor(
    private redirectService: RedirectService,
    private authService: AuthService,
    private enumerationService: EnumerationService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return forkJoin([
      this.authService.init(),
      this.enumerationService.init(),
    ]).pipe(
      map(() => true),
      catchError((err) => {
        console.log('caught error in init guard: ', err);
        return of(this.redirectService.getUnavailableTree());
      })
    );
  }

}
