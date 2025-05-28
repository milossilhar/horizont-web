import { Injectable } from '@angular/core';
import { EventDTO } from '../../rest/model/event';
import { EventStatus } from '../enum/event-status';
import { isFuture, isPast } from 'date-fns';
import { EventTermCapacityStatus } from '../enum/event-term-capacity-status';
import { EventTermCapacityResponsePublicDTO } from '../../rest/model/event-term-capacity-response-public';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

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
    if (remainsPercent <= 45) return EventTermCapacityStatus.ALMOST_FILLED;
    if (remainsPercent <= 20) return EventTermCapacityStatus.FILLING;
    return EventTermCapacityStatus.FREE;
  }
}
