import { Component, OnInit } from '@angular/core';
import { Destroyable } from '../../shared/base/destroyable';
import { Subject, tap } from 'rxjs';
import { EventHorizontService } from '../../rest/api/event.service';
import { AsyncPipe } from '@angular/common';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventPublicDTO } from '../../rest/model/event-public';

@Component({
  selector: 'app-registration-list',
  imports: [ AsyncPipe, EventCardComponent ],
  templateUrl: './registration-list.component.html',
  styles: ''
})
export class RegistrationListComponent extends Destroyable implements OnInit {
  
  protected events = new Subject<EventPublicDTO[]>();
  
  constructor(private eventHorizontService: EventHorizontService) {
    super();
  }

  ngOnInit(): void {
    this.eventHorizontService.getCurrentEvents().pipe(
      tap(events => this.events.next(events))
    ).subscribe();
  }

}
