import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({template: ''})
export class DestroyableComponent implements OnDestroy {
  
  protected destroy$ = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
