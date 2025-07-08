import { Sort } from './sort';

export interface SortOption {
  label: string,
  type: 'numeric' | 'alpha' | 'amount' | 'date',
  value: Sort
}
