import { Observable } from 'rxjs';
import { PageableDTO } from '../../rest/model/pageable';
import { PageableResponse } from './pageable-response';
import { SortOption } from './sort-option';
import { FilterOption } from './filter-option';
import { PageableRequest } from './pageable-request';

/**
 * Interface that every entity service must implement to be used in data component.
 */
export interface DataViewableService {
  loadData(pageable: PageableRequest): Observable<PageableResponse>;
  sortingOptions(): Array<SortOption>;
  filterOptions(): Array<FilterOption>;
}