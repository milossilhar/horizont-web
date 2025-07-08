import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { Dictionary, find, filter, sortBy } from 'lodash';
import { EnumerationRestService } from '../../rest/api/enumeration.service';
import { EventDTO } from '../../rest/model/event-dto';
import { EnumerationItem } from '../types/enumeration-item';

const LOCAL_ENUMS: Dictionary<Array<EnumerationItem>> = {
  'EVENT_STATUS': [
    { code: EventDTO.StatusEnum.Draft, name: 'Koncept', description: 'Nepublikovaná udalosť', type: 'item', ordering: 1, severity: 'info' },
    { code: EventDTO.StatusEnum.Published, name: 'Publikovaný', type: 'item', ordering: 2 },
    { code: EventDTO.StatusEnum.Deleted, name: 'Vymazaný', type: 'item', ordering: 3 },
    { code: EventDTO.StatusEnum.Cancelled, name: 'Zrušený', type: 'item', ordering: 4 },
  ]
};

@Injectable({
  providedIn: 'root'
})
export class EnumerationService {

  private _cachedEnums: Dictionary<Array<EnumerationItem>> = {};
  private _cachedEnums$ = new ReplaySubject<Dictionary<Array<EnumerationItem>>>(1);

  private set cachedEnums(enums: Dictionary<Array<EnumerationItem>>) {
    const fullEnums = {...LOCAL_ENUMS, ...enums};
    this._cachedEnums = fullEnums;
    this._cachedEnums$.next(fullEnums);
  }

  constructor(
    private enumerationRestService: EnumerationRestService
  ) { }

  public init(): Observable<any> {
    return this.enumerationRestService.getItemsAdministrated().pipe(
      tap(enumerations => this.cachedEnums = enumerations)
    );
  }

  public created(enumName: string, item: EnumerationItem) {
    if (!this._cachedEnums[enumName]) this._cachedEnums[enumName] = [];

    this._cachedEnums[enumName].push(item);
    this._cachedEnums$.next(this._cachedEnums);
  }

  public update(enumName: string, items: Array<EnumerationItem>) {
    if (!this._cachedEnums[enumName]) return;

    this._cachedEnums[enumName] = items;
    this._cachedEnums$.next(this._cachedEnums);
  }

  public getEnum(enumName: string, includeInvisible: boolean = false): Observable<Array<EnumerationItem>> {
    return this._cachedEnums$.asObservable().pipe(
      map(enums => sortBy(enums[enumName] ?? [], e => e.ordering)),
      map(values => includeInvisible ? values : filter(values, e => !e.hidden))
    );
  }

  public getEnumItem(name: string, code: string): EnumerationItem | undefined {
    return find(this._cachedEnums[name] ?? [], e => e.code === code);
  }
}
