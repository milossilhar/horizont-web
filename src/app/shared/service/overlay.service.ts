import { Injectable, Type } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { NgButtonSeverity } from '../types/prime-ng-severities';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {
  }

  public confirm(
    key: 'popup' | 'dialog',
    event: Event,
    message: string,
    header: string,
    props: {
      acceptLabel?: string,
      acceptSeverity?: NgButtonSeverity,
      rejectLabel?: string,
      rejectSeverity?: NgButtonSeverity,
    } = {}): Observable<boolean> {
    const result$ = new Subject<boolean>();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      key: key,
      message: message,
      header: header,
      closable: true,
      closeOnEscape: true,
      acceptButtonProps: {
        label: props.acceptLabel ?? 'Áno',
        severity: props.acceptSeverity ?? 'primary',
      },
      accept: () => {
        result$.next(true);
        result$.complete();
      },
      rejectButtonProps: {
        label: props.rejectLabel ?? 'Zrušiť',
        severity: props.rejectSeverity ?? 'contrast',
        outlined: true
      },
      reject: () => {
        result$.next(false);
        result$.complete();
      }
    });
    return result$;
  }

  public open<T, DataType = any, R = any>(component: Type<T>, inputValues: Record<string, any> = {}, data?: DataType): Observable<R> {
    return this.dialogService.open<T, DataType>(component, {
      showHeader: false,
      data: data,
      inputValues: inputValues,
      modal: true,
    }).onClose;
  }
}
