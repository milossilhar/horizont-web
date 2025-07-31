import { DataViewPageEvent } from 'primeng/dataview';
import { Page } from '../types/page';
import { startsWith } from 'lodash-es';

/**
 * Converts a PrimeNG DataViewPageEvent object into a Page object.
 *
 * This function calculates the page number and size based on the provided
 * DataViewPageEvent. The page number is determined by dividing the `first`
 * property by the `rows` property of the event and rounding the result,
 * while the size corresponds to the `rows` property.
 *
 * @param {DataViewPageEvent} primeNgEvent - The event object provided by
 * PrimeNG containing pagination information such as `first` and `rows`.
 * @returns {Page} An object containing pagination details, where `page` is
 * the computed page number and `size` is the number of rows per page.
 */
export const pageConvert = (primeNgEvent: DataViewPageEvent): Page => {
  return {
    page: Math.round(primeNgEvent.first / primeNgEvent.rows),
    size: primeNgEvent.rows
  };
}

/**
 * Normalizes an icon class name by ensuring it is prefixed with "pi".
 *
 * If the input value does not already start with the prefix "pi ",
 * the function prepends "pi " to the value. If the input value
 * is undefined or falsy, it is returned as-is.
 *
 * @param {string | undefined} value - The icon class name to normalize.
 * @returns {string | undefined} The normalized icon class name with the "pi" prefix,
 * or the original value if it is falsy or already starts with "pi ".
 */
export const iconNormalizer = (value?: string): string | undefined => {
  if (!value) return value;
  return startsWith('pi ', value) ? value : `pi ${value}`;
}
