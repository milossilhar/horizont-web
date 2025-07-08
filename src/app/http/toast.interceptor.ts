import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, Observable, tap, throwError } from 'rxjs';
import { ToastService } from '../shared/service/toast.service';
import { MustacheService } from '../shared/service/mustache.service';

@Injectable({
  providedIn: 'root'
})
export class ToastInterceptor implements HttpInterceptor {

  private readonly ERROR_MESSAGES: Record<string, string> = {
    MSG_NOT_FOUND_ENUMERATION_ITEM: 'Nenájdená položka číselníka',
    MSG_NOT_FOUND_EVENT: '',
    MSG_NOT_FOUND_EVENT_TERM: '',
    MSG_NOT_FOUND_PAYMENT: '',
    MSG_NOT_FOUND_PERIOD: '',
    MSG_NOT_FOUND_REGISTRATION: '',

    // registration messages
    MSG_REG_SOON: '',
    MSG_REG_DEADLINE: '',
    MSG_REG_ALREADY_EXISTS: '',
    MSG_REG_CONFIRM_BAD_STATUS: '',

    // encryption
    MSG_REG_TOKEN_EXCEPTION: '',
    MSG_REG_TOKEN_INVALID: '',

    // enumeration
    MSG_ENUM_TYPE_MISMATCH: '',
    MSG_ENUM_DUPLICATE: '',

    // generic
    MSG_ACCESS_DENIED: 'Prístup zamietnutý.',
    MSG_DATA_INTEGRITY_VIOLATION: '',
    MSG_NOT_FOUND: 'Služba nenájdená. Skúste znova, poprípade kontaktujte podporu.',
    MSG_REQUEST_INVALID: 'Zlý request. Opravte všetky červené polia a skúsite znova. V prípade neúspechu kontaktujte podporu.',
    MSG_TYPE_MISMATCH: '',
    MSG_GENERIC_ERROR: 'Všeobecná chyba servera s identifikátorom {{uuid}}. Kontaktujte podporu.',
    DEFAULT: 'Všeobecná chyba servera. Kontaktujte podporu.'
  };

  private readonly STATUS_SEVERITY: Record<number, 'error' | 'warn' | 'info' | 'success'> = {
    200: 'success',
    201: 'success',
    400: 'error',
    401: 'warn',
    403: 'warn',
    404: 'error',
    500: 'error',
    0: 'error',
  }

  constructor(
    private toastService: ToastService,
    private mustacheService: MustacheService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      filter(event => event.type === HttpEventType.Response),
      tap(() => {
        console.log(`completed ${req.method} ${req.urlWithParams}`);
      }),
      catchError(err => {
        const code = err?.error?.code as string | undefined;
        const status = err?.status as number | undefined;

        const message = this.ERROR_MESSAGES[code ?? 'DEFAULT'] ?? this.ERROR_MESSAGES['DEFAULT'];
        const renderedMessage = this.mustacheService.render(message, err?.error?.parameters ?? {});

        const severity = this.STATUS_SEVERITY[status ?? 0] ?? this.STATUS_SEVERITY[0];
        this.toastService[severity](renderedMessage);

        return throwError(() => err);
      })
    );
  }
}