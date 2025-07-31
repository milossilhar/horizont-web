import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { noop } from 'lodash-es';

type RedirectKeys = 'home'
  | 'auth'
  | 'events'
  | 'eventDetail'
  | 'unavailable'
  | 'notfound'
;

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  private _routes: Record<RedirectKeys, any[]> = {
    home: ['home'],
    auth: ['auth'],
    events: ['app', 'events'],
    eventDetail: ['app', 'events', '{{id}}'],
    unavailable: ['unavailable'],
    notfound: ['notfound']
  }

  constructor(
    private router: Router
  ) { }

  public getTree(key: RedirectKeys, params: Record<string, string> = {}) {
    const route = this._transformRoute(this._findRoute(key), params);
    return this.router.createUrlTree(route);
  }

  public goTo(key: RedirectKeys, params: Record<string, string> = {}, callback?: () => void) {
    const route = this._transformRoute(this._findRoute(key), params);
    this.router.navigate(route).then(callback ?? noop);
  }

  private _findRoute(name: RedirectKeys) {
    if (!this._routes[name]) {
      throw new Error(`Unknown route ${name}`);
    }
    return this._routes[name];
  }

  private _transformRoute(route: string[], params: Record<string, string>) {
    return route.map(r => {
      const pattern = r.match(/^{{(.*)}}$/);
      if (!pattern) return r;

      return params[pattern[1]];
    });
  }
}
