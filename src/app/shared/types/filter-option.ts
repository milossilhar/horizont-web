export type FilterOptionType = 'text' | 'enum';

export interface FilterOption {
  label: string,
  placeholder: string,
  type: FilterOptionType,
  prop: string,
  enumName?: string
}
