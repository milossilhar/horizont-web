import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../../shared/base/destroyable.component';
import { BehaviorSubject, map, ReplaySubject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { Dictionary, groupBy } from 'lodash';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { EventService } from '../../shared/service/event.service';
import { EventStatus } from '../../shared/enum/event-status';
import { PublicHorizontService } from '../../rest/api/public.service';
import { EventEventPublicDTO } from '../../rest/model/models';

@Component({
  selector: 'app-registration-list',
  imports: [
    AsyncPipe, EventCardComponent,
    DividerModule, MessageModule
  ],
  templateUrl: './registration-list.component.html',
  styles: ''
})
export class RegistrationListComponent extends DestroyableComponent implements OnInit {
  protected EventStatusType = EventStatus;

  private static readonly EVENT_CHECK_INTERVAL = 1000; //ms

  private cachedEvents = new ReplaySubject<EventEventPublicDTO[]>(1);

  protected events: Dictionary<BehaviorSubject<EventEventPublicDTO[]>> = { };
  
  constructor(
    private eventService: EventService,
    private publicHorizontService: PublicHorizontService) {
    super();

    // initialize events dictionary with all states
    Object.keys(EventStatus)
      .map(key => this.events[key] = new BehaviorSubject<EventEventPublicDTO[]>([]));
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
    
    this.publicHorizontService.getEventsCurrent().pipe(
      tap(events => this.cachedEvents.next(events)),
    ).subscribe();
  }

  protected hasEventsWithStatus(status: EventStatus) {
    return this.events[status].asObservable().pipe(map(arr => arr.length > 0));
  }

}
