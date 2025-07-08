import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EventDTO } from '../../rest/model/event-dto';
import { MessageModule } from 'primeng/message';
import { EnumTagComponent } from '../../shared/components/tags/enum-tag/enum-tag.component';
import { LayoutType } from '../../shared/types/layout-type';

@Component({
  selector: 'app-event-card',
  imports: [
    CardModule, MessageModule, ButtonModule, EnumTagComponent
  ],
  templateUrl: './event-card.component.html',
  styles: ``
})
export class EventCardComponent {

  // data-component
  public entity = input.required<EventDTO>();
  public layout = input.required<LayoutType>();
}
