import { ActivatedRouteSnapshot, CanActivate, createUrlTreeFromSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { EnumerationService } from '../service/enumeration.service';
import { AuthService } from '../service/auth.service';

@Injectable({providedIn: 'root'})
export class InitGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private enumerationService: EnumerationService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return forkJoin([
      this.authService.init(),
      this.enumerationService.init(),
    ]).pipe(
      // delay(10000),
      map(() => true),
      catchError((err) => {
        console.log('caught error in init guard: ', err);
        return of(createUrlTreeFromSnapshot(route, ['/unavailable']))
      })
    );
  }

}