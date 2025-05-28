import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { EventTermCapacityStatus } from '../../../enum/event-term-capacity-status';

@Component({
  selector: 'app-remain-capacity-tag',
  imports: [
    TagModule
],
  templateUrl: './remain-capacity-tag.component.html',
  styles: ``
})
export class RemainCapacityTagComponent {

  public status = input.required<EventTermCapacityStatus>();

  protected label = computed(() => {
    switch(this.status()) {
      case EventTermCapacityStatus.FILLED:
        return 'Obsadené';
      case EventTermCapacityStatus.LAST_ONE:
        return 'Posledné miesto';
      case EventTermCapacityStatus.ALMOST_FILLED:
        return 'Posledné miesta';
      case EventTermCapacityStatus.FILLING:
        return 'Termín sa zapĺňa';
      case EventTermCapacityStatus.FREE:
        return 'Voľné miesta';
    }
  });

  protected severity = computed(() => {
    switch(this.status()) {
      case EventTermCapacityStatus.FILLED:
        return 'contrast';
      case EventTermCapacityStatus.LAST_ONE:
      case EventTermCapacityStatus.ALMOST_FILLED:
        return 'danger';
      case EventTermCapacityStatus.FILLING:
        return 'warn';
      case EventTermCapacityStatus.FREE:
        return 'success';
      default:
        return 'secondary';
    }
  });
}
