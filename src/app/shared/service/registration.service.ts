import { Injectable } from '@angular/core';
import { PublicHorizontService } from '../../rest/api/public.service';
import { DataViewableService } from '../types/data-viewable-service';
import { Observable } from 'rxjs';
import { FilterOption } from '../types/filter-option';
import { PageableResponse } from '../types/pageable-response';
import { SortOption } from '../types/sort-option';
import { dataMapper } from '../util/rxjs-utils';
import { PageableRequest } from '../types/pageable-request';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService implements DataViewableService {

  constructor(
    private publicService: PublicHorizontService
  ) { }

  loadData(pageable: PageableRequest): Observable<PageableResponse> {
    return dataMapper(
      this.publicService.getRegistrations(pageable)
    );
  }
  sortingOptions(): Array<SortOption> {
    throw new Error('Method not implemented.');
  }
  filterOptions(): Array<FilterOption> {
    throw new Error('Method not implemented.');
  }

}
