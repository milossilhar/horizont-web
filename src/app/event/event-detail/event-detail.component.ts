import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventEventInternalDTO, EventTermEventTermDTO } from '../../rest/model/models';
import { EventHorizontService, EventTermHorizontService } from '../../rest/api/api';
import { catchError, concatMap, filter, of, takeUntil, tap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DestroyableComponent } from '../../shared/base/destroyable.component';
import { EventTermSelectorComponent } from "../../shared/form/event-term-selector/event-term-selector.component";
import { RegistrationsComponent } from '../../registration/registrations/registrations.component';


@Component({
  selector: 'app-event-detail',
  imports: [
    ReactiveFormsModule,
    CardModule, MessageModule, ButtonModule,
    EventTermSelectorComponent,
    RegistrationsComponent
],
  templateUrl: './event-detail.component.html',
  styles: ``
})
export class EventDetailComponent extends DestroyableComponent implements OnInit {

  protected event = signal<EventEventInternalDTO | undefined>(undefined);

  protected eventTerms: Record<string, EventTermEventTermDTO> = {};

  protected eventTermForm;

  protected terms = computed(() => Array.from(this.event()?.terms?.values() ?? []));

  protected selectedEventTerm = signal<EventTermEventTermDTO | undefined>(undefined);

  constructor (
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventHorizontService: EventHorizontService,
    private eventTermHorizontService: EventTermHorizontService,
  ) {
    super();
    this.eventTermForm = this.fb.control<number | null>(null);
  }

  ngOnInit(): void {
    const eventID = this.route.snapshot.params['eventID'];

    this.eventHorizontService.getDetailedEvent(eventID).pipe(
      tap(event => this.event.set(event))
    ).subscribe();

    this.eventTermForm.valueChanges.pipe(
      filter(eventTermID => !!eventTermID),
      concatMap(eventTermID => {
        if (!eventTermID) return of(null);

        // check cache
        const cachedTerm = this.eventTerms[eventTermID];
        if (!!cachedTerm) return of(cachedTerm);

        return this.eventTermHorizontService.getEventTerm(eventTermID).pipe(
          // save to cache
          tap(eventTerm => { if (eventTerm.id) this.eventTerms[eventTerm.id] = eventTerm; }),
          catchError(() => of(null))
        )
      }),
      filter(e => !!e),
      tap(eventTerm => this.selectedEventTerm.set(eventTerm)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

}
