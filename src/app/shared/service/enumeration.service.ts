import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { Dictionary } from 'lodash';
import { PublicHorizontService } from '../../rest/api/public.service';
import { EnumerationItemPublicDTO } from '../../rest/model/enumeration-item-public';

@Injectable({
  providedIn: 'root'
})
export class EnumerationService {

  private cachedEnums = new ReplaySubject<Dictionary<Array<EnumerationItemPublicDTO>>>(1);

  constructor(private publicHorizontService: PublicHorizontService) { }
  
  public init(): Observable<any> {
    return this.publicHorizontService.getPublicEnumerations().pipe(
      tap(enumerations => this.cachedEnums.next(enumerations))
    );
  }

  public getEnum(name: string): Observable<Array<EnumerationItemPublicDTO>> {
    return this.cachedEnums.asObservable().pipe(
      map(ce => ce[name] ?? [])
    );
  }
}
