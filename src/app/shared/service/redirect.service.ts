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

  public getUnavailableTree() {
    return this.router.createUrlTree(this.unavailable);
  }

  public toUnavailable() {
    this.router.navigate(this.unavailable);
  }

  public toNotFound() {
    this.router.navigate(['/notfound']).then(noop);
  }
}
