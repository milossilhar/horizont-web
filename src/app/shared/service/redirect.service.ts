import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { noop } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(
    private router: Router
  ) { }

  public get unavailable() {
    return ['/unavailable'];
  }

  public get events() {
    return ['/events'];
  }

  public getEventDetail(id: number) {
    return ['/events', id];
  }

  public getEventDetailTree(id: number) {
    return this.router.createUrlTree(this.getEventDetail(id));
  }

  public getUnavailableTree() {
    return this.router.createUrlTree(this.unavailable);
  }

  public toUnavailable() {
    this.router.navigate(this.unavailable);
  }

  public toEvents() {
    this.router.navigate(this.events);
  }

  public toNotFound() {
    this.router.navigate(['/notfound']).then(noop);
  }

  public toHome() {
    this.router.navigate(['/']).then(noop);
  }
}
