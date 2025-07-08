import { inject, Type } from '@angular/core';
import { EventCardComponent } from '../../../event/event-card/event-card.component';
import { EventFormComponent } from '../../../event/event-form/event-form.component';
import { EventService } from '../../service/event.service';
import { DataViewableService } from '../../types/data-viewable-service';

export type ConfigEntryType = {
  service: DataViewableService,
  component: Type<any> | null,
  creationFormComponent: Type<any> | null,
};

export type ConfigType = Record<string, ConfigEntryType>;

export function createDataConfig(): ConfigType {
  return {
    events: {
      service: inject(EventService),
      component: EventCardComponent,
      creationFormComponent: EventFormComponent
    }
  };
}
