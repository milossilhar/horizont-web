import { catchError, map, Observable, of } from 'rxjs'
import { PageableResponse } from '../types/pageable-response'

export const dataMapper = (source: Observable<any>) => {
  return source.pipe(
    map(({content, totalElements}: any): PageableResponse => ({ content: content ?? [], total: totalElements ?? 0 })),
    catchError((): Observable<PageableResponse> => of({ content: [], total: 0 })),
  );
}