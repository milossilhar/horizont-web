import { Observable } from 'rxjs';
import { PageableResponse } from './pageable-response';
import { FilterOption } from './filter-option';
import { PageableRequest } from './pageable-request';
import { SortOption } from './sort-option';

/**
 * A service interface that provides functionalities for loading and managing data with sorting and filtering capabilities.
 */
export interface DataViewableService {
  /**
   * Loads pageable data based on the provided request parameters.
   *
   * @param {PageableRequest} pageable - The request object containing pagination and sorting details.
   * @return {Observable<PageableResponse>} An observable that emits the response with paginated data.
   */
  loadData(pageable: PageableRequest): Observable<PageableResponse>;

  /**
   * Retrieves a list of sorting options, each represented as a label-value pair.
   * The method provides a way to get available sorting configurations.
   *
   * @return {Array<SortOption>} An array of label-value objects where the label is a string and the value is a sorting configuration.
   */
  sortingOptions(): Array<SortOption>;

  /**
   * Filters and retrieves a list of available options based on certain criteria.
   * Performs any necessary processing to return the filtered options.
   *
   * @return {Observable<Array<FilterOption>>} An observable that emits an array of filtered options.
   */
  filterOptions(): Observable<Array<FilterOption>>;
}
