import { Component, computed, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EventService } from '../../shared/service/event.service';
import { EventStatus } from '../../shared/types/enum/event-status';
import { MessageModule } from 'primeng/message';
import { EventEventPublicDTO } from '../../rest/model/models';

@Component({
  selector: 'app-event-card',
  imports: [
    RouterLink,
    DatePipe, CurrencyPipe,
    CardModule, MessageModule, ButtonModule
  ],
  templateUrl: './event-card.component.html',
  styles: ``
})
export class EventCardComponent {

  public event = input<EventEventPublicDTO>();

  public minimal = input<boolean>(false);

  public showDiscount = input<boolean>(false);
  
  constructor(private eventService: EventService) { }
  
  protected full = computed(() => !this.minimal());
  protected eventStatus = computed(() => this.eventService.getStatus(this.event()));

  protected formattedDetails = computed(() => !!this.event() ? this.event()?.details.replaceAll(/([.!?]) /g, "$1\n") : '');

  protected isFuture = computed(() => this.eventStatus() === EventStatus.FUTURE);
  protected isActive = computed(() => this.eventStatus() === EventStatus.ACTIVE);
  protected isClosed = computed(() => this.eventStatus() === EventStatus.CLOSED);

  protected hasDiscountTabor = computed(() => this.event()?.discountType === '25TABOR');
}
