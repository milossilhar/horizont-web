import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { forEach } from 'lodash-es';
import { Observable } from 'rxjs';

export class SortParameterInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sortParams = req.params.getAll('sort');

    if (!sortParams || sortParams.length === 0) return next.handle(req);

    if (sortParams.length === 1) {
      const parsedSortParams = JSON.parse(sortParams[0]);
      if (Array.isArray(parsedSortParams)) {
        let params = req.params.delete('sort');

        forEach(parsedSortParams, value => {
          params = params.append('sort', value);
        });

        return next.handle(req.clone({ params }));
      }
    }

    return next.handle(req);

  }

}