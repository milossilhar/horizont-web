import { Injectable } from '@angular/core';
import { filter, map, Observable, ReplaySubject, tap } from 'rxjs';
import { Dictionary, find, filter as lodashFilter, sortBy, forOwn } from 'lodash';
import { EnumerationRestService } from '../../rest/api/enumeration.service';
import { EnumerationDTO } from '../../rest/model/enumeration-dto';
import { EnumerationItemAggregateDTO } from '../../rest/model/enumeration-item-aggregate-dto';
import { EventDTO } from '../../rest/model/event-dto';
import { EventTermDTO } from '../../rest/model/event-term-dto';
import { Enumeration } from '../types/enumeration';
import { EnumerationItem } from '../types/enumeration-item';
import { EnumerationName } from '../types/enumeration-name';

const ENUM_NAMES: Record<EnumerationName, string> = {
  'REG_EVENT_CONDITION_TYPE': 'Druhy obmedzení udalostí',
  'REG_EVENT_DISCOUNT_TYPE': 'Druhy zľavy',
  'REG_EVENT_TERM_TAG': 'Označenia termínov',
  'REG_PLACE': 'Miesta',
  'REG_PERIOD': 'Obdobia',
  'REG_RELATION': 'Vzťahy',
  'REG_SHIRT_SIZE': 'Veľkosti tričiek'
}

const LOCAL_ENUMS: Dictionary<Enumeration> = {
  'YES_NO': {
    administrated: false,
    values: [
      // we need to fake typescript so it is happy
      { code: true as any, name: 'Áno', type: 'local', ordering: 1 },
      { code: false as any, name: 'Nie', type: 'local', ordering: 2 }
    ]
  },
  'EVENT_TERM_REPEAT_TYPE': {
    name: 'Druhy opakovaní termínov',
    administrated: false,
    values: [
      { code: EventTermDTO.RepeatTypeEnum.Once, name: 'Jedenkrát', description: 'Jednorázová udalosť v presný čas', type: 'local', ordering: 1 },
      { code: EventTermDTO.RepeatTypeEnum.Daily, name: 'Denne', description: 'Každý deň v uvedenom období', type: 'local', ordering: 2 },
      { code: EventTermDTO.RepeatTypeEnum.Weekly, name: 'Týždenne', description: 'Raz za týždeň v daný deň', type: 'local', ordering: 3 }
    ]
  },
  'DAY_OF_WEEK': {
    name: 'Dni v týždni',
    administrated: false,
    values: [
      { code: EventTermDTO.DayOfWeekEnum.Monday, name: 'Pondelok', type: 'local', ordering: 1 },
      { code: EventTermDTO.DayOfWeekEnum.Tuesday, name: 'Utorok', type: 'local', ordering: 2 },
      { code: EventTermDTO.DayOfWeekEnum.Wednesday, name: 'Streda', type: 'local', ordering: 3 },
      { code: EventTermDTO.DayOfWeekEnum.Thursday, name: 'Štvrtok', type: 'local', ordering: 4 },
      { code: EventTermDTO.DayOfWeekEnum.Friday, name: 'Piatok', type: 'local', ordering: 5 },
      { code: EventTermDTO.DayOfWeekEnum.Saturday, name: 'Sobota', type: 'local', ordering: 6 },
      { code: EventTermDTO.DayOfWeekEnum.Sunday, name: 'Nedeľa', type: 'local', ordering: 7 }
    ]
  },
  'EVENT_STATUS': {
    name: 'Stavy udalostí',
    administrated: false,
    values: [
      { code: EventDTO.StatusEnum.Draft, name: 'Koncept', description: 'Nepublikovaná udalosť', type: 'local', ordering: 1 },
      { code: EventDTO.StatusEnum.Published, name: 'Publikovaný', type: 'local', ordering: 2 },
      { code: EventDTO.StatusEnum.Deleted, name: 'Vymazaný', type: 'local', ordering: 3 },
      { code: EventDTO.StatusEnum.Cancelled, name: 'Zrušený', type: 'local', ordering: 4 },
    ]
  },
  'EVENT_TYPE': {
    name: 'Typy udalostí',
    administrated: false,
    values: [
      { code: EventDTO.EventTypeEnum.Event, name: 'Udalosť', description: 'Všeobecná udalosť', type: 'local', ordering: 1 },
      { code: EventDTO.EventTypeEnum.Eca, name: 'Krúžok', description: 'Pravidelné krúžky', type: 'local', ordering: 2 },
    ]
  },
};

@Injectable({
  providedIn: 'root'
})
export class EnumerationService {

  private _cachedEnums: Dictionary<Enumeration> = {};
  private _cachedEnums$ = new ReplaySubject<Dictionary<Enumeration>>(1);

  private set cachedEnums(enums: Dictionary<EnumerationDTO>) {
    const fullEnums: Dictionary<Enumeration> = {...LOCAL_ENUMS, ...enums};
    forOwn(fullEnums, (e, name) => { if (!e.name) e.name = ENUM_NAMES[name as EnumerationName] ?? name });

    // console.log(`setting enums: \n${JSON.stringify(fullEnums, null, 2)}\n`);
    this._cachedEnums = fullEnums;
    this._cachedEnums$.next(fullEnums);
  }

  constructor(
    private enumerationRestService: EnumerationRestService
  ) { }

  public init(): Observable<boolean> {
    return this.enumerationRestService.getEnumeration().pipe(
      tap(enumerations => this.cachedEnums = enumerations),
      map(() => true)
    );
  }

  public created(enumName: string, item: EnumerationItemAggregateDTO): void {
    if (!this._cachedEnums[enumName]) this._cachedEnums[enumName] = { };
    if (!this._cachedEnums[enumName].values) this._cachedEnums[enumName].values = [];

    this._cachedEnums[enumName].values.push(item);
    this._cachedEnums$.next(this._cachedEnums);
  }

  public getEnum(enumName: string): Enumeration | undefined {
    return this._cachedEnums[enumName];
  }

  public getEnum$(enumName: string, includeInvisible: boolean = false): Observable<Enumeration> {
    return this._cachedEnums$.asObservable().pipe(
      map(enums => enums[enumName]),
      filter(e => !!e),
      map(({values, ...rest}) => {
        const filtered = includeInvisible ? values : lodashFilter(values, e => !e.hidden);
        return {
          values: sortBy(filtered, ['ordering', 'name']),
          ...rest,
        };
      })
    );
  }

  public getEnumItem(name: string, code: string): EnumerationItem | undefined {
    return find(this._cachedEnums[name]?.values ?? [], e => e.code === code);
  }
}
