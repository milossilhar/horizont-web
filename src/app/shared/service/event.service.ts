import { Injectable } from '@angular/core';
import { EventDTO } from '../../rest/model/event';
import { EventStatus } from '../types/enum/event-status';
import { isFuture, isPast } from 'date-fns';
import { EventTermCapacityStatus } from '../types/enum/event-term-capacity-status';
import { EventTermCapacityResponsePublicDTO } from '../../rest/model/event-term-capacity-response-public';
import { DataViewableService } from '../types/data-viewable-service';
import { Observable } from 'rxjs';
import { FilterOption } from '../types/filter-option';
import { PageableResponse } from '../types/pageable-response';
import { SortOption } from '../types/sort-option';
import { PublicHorizontService } from '../../rest/api/public.service';
import { dataMapper } from '../util/rxjs-functions';
import { PageableRequest } from '../types/pageable-request';

@Injectable({
  providedIn: 'root'
})
export class EventService implements DataViewableService {

  constructor(
    private publicHorizontService: PublicHorizontService
  ) { }

  public getStatus(event?: EventDTO): EventStatus | null {
    if (!event) return null;

    if (isFuture(event.regStartAt)) return EventStatus.FUTURE;
    if (isPast(event.regEndAt)) return EventStatus.CLOSED;
    return EventStatus.ACTIVE;
  }

  public getCapacityStatus(eventTermCapacity: EventTermCapacityResponsePublicDTO): EventTermCapacityStatus {
    const capacity = eventTermCapacity.capacity ?? 0;
    const available = eventTermCapacity.available ?? 0;

    const remainsPercent = (available / capacity) * 100;

    if (available <= 0) return EventTermCapacityStatus.FILLED;
    if (available === 1) return EventTermCapacityStatus.LAST_ONE;
    if (remainsPercent <= 20) return EventTermCapacityStatus.ALMOST_FILLED;
    if (remainsPercent <= 45) return EventTermCapacityStatus.FILLING;
    return EventTermCapacityStatus.FREE;
  }

  loadData(pageable: PageableRequest): Observable<PageableResponse> {
    return dataMapper(
      this.publicHorizontService.getEventsPS(pageable)
    );
  }

  sortingOptions(): Array<SortOption> {
    return [
      { sortField: 'createdAt', sortLabel: 'dátum pridania', availableDir: 'both' }
    ];
  }

  filterOptions(): Array<FilterOption> {
    throw new Error('Method not implemented.');
  }
}
