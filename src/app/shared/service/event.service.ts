import { Injectable } from '@angular/core';
import { EventDTO } from '../../rest/model/event';
import { EventStatus } from '../enum/event-status';
import { isFuture, isPast } from 'date-fns';

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
}
