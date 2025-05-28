import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { includes } from 'lodash';
import { BehaviorSubject, catchError, from, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user?: any;
  private _user$ = new BehaviorSubject<any | undefined>(undefined);
  
  constructor(private oauthService: OAuthService) { }
  
  private set user(newUser: any | undefined) {
    this._user = newUser;
    this._user$.next(newUser);
  }

  public get isLoggedInSnapshot() {
    return !!this._user && this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken();
  }

  public get isLoggedIn() {
    return this._user$.pipe(
      map(u => !!u && this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken())
    );
  }

  public hasRole(role: string) {
    return this._user$.pipe(
      map(user => includes(user.roles, role))
    );
  }

  public init() {
    try {
      return from(this.oauthService.loadUserProfile()).pipe(
        tap((user: any) => this.user = user.info ?? user),
        map(() => true),
        catchError(() => {
          this.logout(false);
          return of(true);
        })
      );
    } catch (error) {
      return of(true);
    };
  }

  public toggleLogin() {
    if (this.isLoggedInSnapshot) {
      this.logout(true);
      return;
    }
    
    this.oauthService.initCodeFlow();
  }

  private logout(redirect: boolean = true) {
    this.oauthService.logOut(!redirect);
    this.user = undefined;
  }
}
