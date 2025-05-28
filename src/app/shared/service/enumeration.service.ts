import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { Dictionary, find } from 'lodash';
import { PublicHorizontService } from '../../rest/api/public.service';
import { EnumerationItemPublicDTO } from '../../rest/model/enumeration-item-public';

@Injectable({
  providedIn: 'root'
})
export class EnumerationService {

  private _cachedEnums: Dictionary<Array<EnumerationItemPublicDTO>> = {};
  private _cachedEnums$ = new ReplaySubject<Dictionary<Array<EnumerationItemPublicDTO>>>(1);

  private set cachedEnums(enums: Dictionary<Array<EnumerationItemPublicDTO>>) {
    this._cachedEnums = enums;
    this._cachedEnums$.next(enums);
  }

  constructor(private publicHorizontService: PublicHorizontService) { }
  
  public init(): Observable<any> {
    return this.publicHorizontService.getPublicEnumerations().pipe(
      tap(enumerations => this.cachedEnums = enumerations)
    );
  }

  public getEnum(name: string): Observable<Array<EnumerationItemPublicDTO>> {
    return this._cachedEnums$.asObservable().pipe(
      map(ce => ce[name] ?? [])
    );
  }

  public getEnumItem(name: string, code: string): EnumerationItemPublicDTO | undefined {
    return find(this._cachedEnums[name] ?? [], e => e.code === code);
  }
}
