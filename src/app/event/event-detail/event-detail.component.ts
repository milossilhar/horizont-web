import { Component, input, signal } from '@angular/core';
import { DestroyableComponent } from '../../shared/base/destroyable.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, filter, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { RedirectService } from '../../shared/service/redirect.service';
import { EventRestService } from '../../rest/api/api';
import { EventDTO } from '../../rest/model/event-dto';
import { EnumTagComponent } from '../../shared/components/tags/enum-tag/enum-tag.component';
import { DatePipe } from '@angular/common';
import { EnumPipe } from '../../shared/pipes/enum.pipe';

@Component({
  selector: 'app-event-detail',
  imports: [
    EnumTagComponent,
    DatePipe,
    EnumPipe
  ],
  templateUrl: './event-detail.component.html',
  styles: ``
})
export class EventDetailComponent extends DestroyableComponent {

  public eventId = input<number>();

  public event = signal<EventDTO | undefined>(undefined);

  constructor(
    private redirectService: RedirectService,
    private eventRestService: EventRestService
  ) {
    super();
    toObservable(this.eventId).pipe(
      map(id => Number(id)),
      tap(id => isNaN(id) && this.redirectService.toEvents()),
      switchMap(id => this.eventRestService.getEventById(id).pipe(
        catchError(() => {
          this.redirectService.toEvents();
          return of(null);
        })
      )),
      filter(event => !!event),
      tap(event => this.event.set(event)),
      takeUntil(this.destroy$)
    ).subscribe();
  }
}
