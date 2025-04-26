import { Component, OnInit } from '@angular/core';
import { Destroyable } from '../../shared/base/destroyable';
import { BehaviorSubject, map, ReplaySubject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { EventHorizontService } from '../../rest/api/event.service';
import { AsyncPipe } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventPublicDTO } from '../../rest/model/event-public';
import { Dictionary, groupBy } from 'lodash';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { EventService } from '../../shared/service/event.service';
import { EventStatus } from '../../shared/enum/event-status';

@Component({
  selector: 'app-registration-list',
  imports: [
    AsyncPipe, EventCardComponent,
    DividerModule, MessageModule
  ],
  templateUrl: './registration-list.component.html',
  styles: ''
})
export class RegistrationListComponent extends Destroyable implements OnInit {
  protected EventStatusType = EventStatus;

  private static readonly EVENT_CHECK_INTERVAL = 1000; //ms

  private cachedEvents = new ReplaySubject<EventPublicDTO[]>(1);

  protected events: Dictionary<BehaviorSubject<EventPublicDTO[]>> = { };
  
  constructor(
    private eventService: EventService,
    private eventHorizontService: EventHorizontService) {
    super();

    // initialize events dictionary with all states
    Object.keys(EventStatus)
      .map(key => this.events[key] = new BehaviorSubject<EventPublicDTO[]>([]));
  }
  
  ngOnInit(): void {
    timer(0, RegistrationListComponent.EVENT_CHECK_INTERVAL).pipe(
      switchMap(() => this.cachedEvents.asObservable()),
      tap(events => {
        const grouppedEvents = groupBy(events, e => this.eventService.getStatus(e));
        Object.keys(grouppedEvents).forEach(key => this.events[key].next(grouppedEvents[key]));
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    
    this.eventHorizontService.getCurrentEvents().pipe(
      tap(events => this.cachedEvents.next(events)),
    ).subscribe();
  }

  protected hasEventsWithStatus(status: EventStatus) {
    return this.events[status].asObservable().pipe(map(arr => arr.length > 0));
  }

}
