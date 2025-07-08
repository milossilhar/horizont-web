/**
 * Represents sorting configuration for a collection or dataset.
 *
 * @interface Sort
 * @property {string} sortField - The name of the field by which the dataset should be sorted.
 * @property {'asc' | 'desc'} sortOrder - The order of sorting, either ascending ('asc') or descending ('desc').
 */
export interface Sort {
  sortField: string;
  sortOrder: 'asc' | 'desc';
}
