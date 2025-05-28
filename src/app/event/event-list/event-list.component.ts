import { Component, OnInit, signal } from '@angular/core';
import { EventHorizontService } from '../../rest/api/event.service';
import { tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { find, reduce } from 'lodash';
import { RouterLink } from '@angular/router';
import { EventEventInternalDTO, EventTermCapacityEventInternalDTO, EventTermEventInternalDTO } from '../../rest/model/models';
import { TooltipModule } from 'primeng/tooltip';

interface CapacityMessageConfig {
  title: string;
  severity: "info" | "success" | "warn" | "danger" | "secondary" | "contrast";
}

@Component({
  selector: 'app-event-list',
  imports: [
    DatePipe, RouterLink,
    BadgeModule, CardModule, MessageModule, ButtonModule, TooltipModule
  ],
  templateUrl: './event-list.component.html',
  styles: ``
})
export class EventListComponent implements OnInit {

  protected registrationStatues = [
    // EventTermCapacityEventInternalDTO.StatusEnum.Concept,
    EventTermCapacityEventInternalDTO.StatusEnum.Confirmed,
    EventTermCapacityEventInternalDTO.StatusEnum.Queue
  ];

  protected events = signal<EventEventInternalDTO[]>([]);

  constructor(private eventHorizontService: EventHorizontService) {}

  ngOnInit(): void {
    this.eventHorizontService.getDetailedEvents().pipe(
      tap(events => this.events.set(events))
    ).subscribe();
  }

  getTermRegistrations(term: EventTermEventInternalDTO): number {
    return reduce(term.currentCapacities, (acc, curr) => acc + (curr.registrations ?? 0), 0);
  }

  getCapacityForStatus(term: EventTermEventInternalDTO, status: EventTermCapacityEventInternalDTO.StatusEnum) {
    if (!term.currentCapacities) return undefined;

    return find(term.currentCapacities, cc => cc.status === status);
  }

  getCapacityMessageConfig(status: EventTermCapacityEventInternalDTO.StatusEnum): CapacityMessageConfig {
    switch(status) {
      case 'CONCEPT': return { title: 'Nepotvrdené', severity: 'secondary' };
      case 'QUEUE': return { title: 'V poradí', severity: 'danger' };
      case 'CONFIRMED': return { title: 'Potvrdené', severity: 'success' };
    }
  }
}
