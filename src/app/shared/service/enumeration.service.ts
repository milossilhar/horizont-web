import { Injectable } from '@angular/core';
import { Initialization } from '../base/initialization';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { EnumerationItemDTO } from '../../rest/model/enumeration-item';
import { Dictionary } from 'lodash';
import { EnumerationHorizontService } from '../../rest/api/enumeration.service';

@Injectable({
  providedIn: 'root'
})
export class EnumerationService implements Initialization {

  private cachedEnums = new ReplaySubject<Dictionary<Array<EnumerationItemDTO>>>(1);

  constructor(private enumerationHorizontService: EnumerationHorizontService) { }

  public init(): Observable<any> {
    return this.enumerationHorizontService.getVisibleEnumerations().pipe(
      tap(enumerations => this.cachedEnums.next(enumerations))
    );
  }

  public getEnum(name: string): Observable<Array<EnumerationItemDTO>> {
    return this.cachedEnums.asObservable().pipe(
      map(ce => ce[name] ?? [])
    );
  }
}
