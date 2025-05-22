import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({ standalone: true })
export class DestroyableDirective implements OnDestroy {
  
  protected destroy$ = new Subject<boolean>();
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}