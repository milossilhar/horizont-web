import { Component, OnInit, signal } from '@angular/core';
import { EventHorizontService } from '../../rest/api/event.service';
import { tap } from 'rxjs';
import { EventInternalDTO } from '../../rest/model/event-internal';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { EventTermInternalDTO } from '../../rest/model/event-term-internal';
import { find, reduce } from 'lodash';
import { EventTermCapacityInternalDTO } from '../../rest/model/event-term-capacity-internal';
import { RouterLink } from '@angular/router';

interface CapacityMessageConfig {
  title: string;
  severity: "info" | "success" | "warn" | "danger" | "secondary" | "contrast";
}

@Component({
  selector: 'app-event-list',
  imports: [
    DatePipe, RouterLink,
    BadgeModule, CardModule, MessageModule, ButtonModule
  ],
  templateUrl: './event-list.component.html',
  styles: ``
})
export class EventListComponent implements OnInit {

  protected registrationStatues = [
    EventTermCapacityInternalDTO.StatusEnum.Concept,
    EventTermCapacityInternalDTO.StatusEnum.Confirmed,
    EventTermCapacityInternalDTO.StatusEnum.Accepted,
    EventTermCapacityInternalDTO.StatusEnum.Queue
  ];

  protected events = signal<EventInternalDTO[]>([]);

  constructor(private eventHorizontService: EventHorizontService) {}

  ngOnInit(): void {
    this.eventHorizontService.getEventsDetailed().pipe(
      tap(events => this.events.set(events))
    ).subscribe();
  }

  getTermRegistrations(term: EventTermInternalDTO): number {
    return reduce(term.currentCapacities, (acc, curr) => acc + (curr.registrations ?? 0), 0);
  }

  getCapacityForStatus(term: EventTermInternalDTO, status: EventTermCapacityInternalDTO.StatusEnum) {
    if (!term.currentCapacities) return undefined;

    return find(term.currentCapacities, cc => cc.status === status);
  }

  getCapacityMessageConfig(status: EventTermCapacityInternalDTO.StatusEnum): CapacityMessageConfig {
    switch(status) {
      case 'CONCEPT': return { title: 'Nepotvrdené', severity: 'secondary' };
      case 'QUEUE': return { title: 'V poradí', severity: 'warn' };
      case 'CONFIRMED': return { title: 'Potvrdené', severity: 'info' };
      case 'ACCEPTED': return { title: 'Akceptované', severity: 'success' };
    }
  }
}
