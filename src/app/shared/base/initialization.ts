import { Observable } from 'rxjs';

export interface Initialization {
  init(): Observable<any>;
}