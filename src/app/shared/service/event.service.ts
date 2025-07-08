import { Injectable } from '@angular/core';
import { EventRestService } from '../../rest/api/event.service';
import { DataViewableService } from '../types/data-viewable-service';
import { Observable, of } from 'rxjs';
import { FilterOption } from '../types/filter-option';
import { PageableResponse } from '../types/pageable-response';
import { SortOption } from '../types/sort-option';
import { dataMapper } from '../util/rxjs-utils';
import { PageableRequest } from '../types/pageable-request';

@Injectable({
  providedIn: 'root'
})
export class EventService implements DataViewableService {

  constructor(
    private eventRestService: EventRestService
  ) { }

  loadData(pageable: PageableRequest): Observable<PageableResponse> {
    return dataMapper(
      this.eventRestService.getAll(pageable)
    );
  }

  sortingOptions(): Array<SortOption> {
    return [
      { label: 'Dátum pridania', type: 'date', value: { sortField: 'createdAt', sortOrder: 'asc' }},
      { label: 'Dátum pridania', type: 'date', value: { sortField: 'createdAt', sortOrder: 'desc' }},
    ]
  }

  filterOptions(): Observable<Array<FilterOption>> {
    return of([
      { label: 'Stav', placeholder: 'Filtruj stav udalosti', prop: 'eventType', type: 'enum', enumName: 'EVENT_STATUS' }
    ])
  }
}
