/**
 * Result used from paginated backend resource. Could be using generated, but here I have more control.
 */
export interface PageableResponse {
  content: Array<any>;
  total: number;
}
