import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class ContentTypeInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const CONTENT_TYPE_HEADER = 'Content-Type';
    const APPLICATION_JSON = 'application/json';

    if (req.headers.has(CONTENT_TYPE_HEADER)) {
      return next.handle(req);
    }

    const reqWithContentType = req.clone({ headers: req.headers.append(CONTENT_TYPE_HEADER, APPLICATION_JSON) });
    return next.handle(reqWithContentType);
  }

}