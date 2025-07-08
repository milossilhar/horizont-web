/**
 * Represents a pagination structure for handling paginated data.
 *
 * The `Page` interface provides the necessary details for specifying
 * a particular page of data and the number of items per page.
 *
 * @property page - The current page number, starting from 0.
 * @property size - The number of items to include per page.
 */
export interface Page {
  page: number;
  size: number;
}
