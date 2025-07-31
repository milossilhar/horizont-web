import { Injectable, signal } from '@angular/core';
import Session from 'supertokens-web-js/recipe/session';
import { UserRoleClaim } from "supertokens-web-js/recipe/userroles";
import { RedirectService } from './redirect.service';
import { Router } from '@angular/router';
import { includes, isArray } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _authenticated = signal<boolean>(false);
  public get authenticated() {
    return this._authenticated.asReadonly();
  }

  constructor(
    private router: Router,
    private redirectService: RedirectService,
  ) { }

  public async init() {
    await this.existsSession();
    return true;
  }

  public login(redirectCommands: any[] = []) {
    console.log('invoking login with redirect route: ', this.router.serializeUrl(this.router.createUrlTree(redirectCommands)));
    this.redirectService.goTo('auth');
  }

  public async hasRole(role: string) {
    if (await this.existsSession()) {
      const roles = await Session.getClaimValue({ claim: UserRoleClaim });
      return isArray(roles) && includes(roles, role);
    }
    return false;
  }

  public async attemptRefresh() {
    await Session.attemptRefreshingSession();
  }

  public async logout() {
    if (await this.existsSession()) {
      await Session.signOut();
      this._authenticated.set(false);
      this.redirectService.goTo('home');
    }
  }

  private async existsSession() {
    const sessionExists = await Session.doesSessionExist();
    this._authenticated.set(sessionExists);
    return sessionExists;
  }
}
