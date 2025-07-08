import { catchError, map, Observable, of } from 'rxjs'
import { PageableResponse } from '../types/pageable-response'

/**
 * A function that transforms an observable of data into a specific pageable response structure.
 *
 * This function takes an Observable as the source input and applies transformations
 * to map its content and total elements properties into a `PageableResponse` object.
 * If an error occurs during the processing of the source Observable, it catches the error
 * and returns a default `PageableResponse` object with an empty content array and total of 0.
 *
 * @param source - The input Observable containing data to be transformed.
 * @returns A new Observable that emits `PageableResponse` objects.
 */
export const dataMapper = (source: Observable<any>) => {
  return source.pipe(
    map(({content, totalElements}: any): PageableResponse => ({ content: content ?? [], total: totalElements ?? 0 })),
    catchError((): Observable<PageableResponse> => of({ content: [], total: 0 })),
  );
}
