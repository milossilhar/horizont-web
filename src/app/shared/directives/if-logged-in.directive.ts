import { Directive, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { takeUntil, tap } from 'rxjs';
import { DestroyableDirective } from '../base/destroyable.directive';

@Directive({
  selector: '[ifLoggedIn]',
  standalone: true,
  hostDirectives: [ NgIf ]
})
export class IfLoggedInDirective extends DestroyableDirective implements OnInit {

  private readonly ngIfDirective = inject(NgIf);

  constructor(
    private readonly authService: AuthService) { super(); }

  ngOnInit(): void {
    this.authService.isLoggedIn.pipe(
      tap(loggedIn => this.ngIfDirective.ngIf = loggedIn),
      takeUntil(this.destroy$)
    ).subscribe();
  }

}
