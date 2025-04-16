import { Component, Input } from '@angular/core';
import { EventDTO } from '../../rest/model/event';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { EventPublicDTO } from '../../rest/model/event-public';

@Component({
  selector: 'app-event-card',
  imports: [
    RouterLink,
    CardModule,
    ButtonModule
  ],
  templateUrl: './event-card.component.html',
  styles: ``
})
export class EventCardComponent {

  @Input({ required: true })
  public event?: EventPublicDTO;

  @Input()
  public showImage = true;

  @Input()
  public showButton = true;
}
