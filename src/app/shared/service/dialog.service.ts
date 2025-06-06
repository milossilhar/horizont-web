import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private confirmationService: ConfirmationService
  ) { }

  public confirmDialog(event: Event, message: string, header: string, acceptLabel?: string): Observable<boolean> {
    const result$ = new Subject<boolean>();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: message,
      header: header,
      closable: true,
      closeOnEscape: true,
      acceptButtonProps: {
        label: acceptLabel ?? 'Áno',
      },
      accept: () => {
        result$.next(true);
        result$.complete();
      },
      rejectButtonProps: {
        label: 'Zrušiť',
        severity: 'secondary',
        outlined: true
      },
      reject: () => {
        result$.next(false);
        result$.complete();
      }
    });
    return result$;
  }
}
