import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgToastSeverity } from '../types/prime-ng-severities';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private messageService: MessageService
  ) { }

  public info(message: string, header: string = 'Informácia') {
    this.msg('info', message, header);
  }

  public success(message: string, header: string = 'Potvrdenie') {
    this.msg('success', message, header);
  }

  public warn(message: string, header: string = 'Upozornenie') {
    this.msg('warn', message, header);
  }

  public error(message: string, header: string = 'Chyba') {
    this.msg('error', message, header);
  }

  private msg(severity: NgToastSeverity, message: string, header: string, ttl: number = 4000) {
    this.messageService.add({
      severity: severity,
      summary: header,
      detail: message,
      life: ttl
    });
  }
}
