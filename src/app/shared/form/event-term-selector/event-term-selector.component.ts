import { Component, effect, forwardRef, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, takeUntil, tap } from 'rxjs';
import { DestroyableComponent } from '../../base/destroyable.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RemainCapacityTagComponent } from "../../components/tags/remain-capacity-tag/remain-capacity-tag.component";
import { PublicHorizontService } from '../../../rest/api/api';
import { Dictionary } from 'lodash';
import { EventTermCapacityResponsePublicDTO, EventTermPublicDTO } from '../../../rest/model/models';
import { MessageModule } from 'primeng/message';
import { EventService } from '../../service/event.service';
import { EventTermCapacityStatus } from '../../enum/event-term-capacity-status';

@Component({
  selector: 'app-event-term-selector',
  imports: [
    DatePipe, CurrencyPipe,
    MessageModule,
    RemainCapacityTagComponent
],
  templateUrl: './event-term-selector.component.html',
  styles: ``,
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EventTermSelectorComponent),
      multi: true
    }]
})
export class EventTermSelectorComponent extends DestroyableComponent implements ControlValueAccessor, OnInit {

  protected EventTermCapacityStatus = EventTermCapacityStatus;

  public terms = input.required<Array<EventTermPublicDTO>>();

  public eventUUID = input<string>();

  public setDefault = input<boolean>(true);

  // shows selector as admin panel
  public showAdmin = input<boolean>(false);

  protected selectedId = signal<number>(-1);
  protected disabled = signal<boolean>(false);
  protected capacities = signal<Dictionary<EventTermCapacityResponsePublicDTO>>({});

  private onChange: (value?: number | null) => void = () => {};
  private onTouched = () => {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private publicHorizontService: PublicHorizontService
  ) {
    super();

    // load capacities for the Event when input gets set
    effect(() => {
      const eventUUID = this.eventUUID();
      if (!eventUUID) return;

      this.publicHorizontService.getEventCapacities(eventUUID).pipe(
        tap(capacities => this.capacities.set(capacities)),
        takeUntil(this.destroy$)
      ).subscribe();
    });

    // setting first option as default
    effect(() => {
      const terms = this.terms();

      if (!terms.length) return;

      if (!this.setDefault() && terms.length > 1) return;

      if (this.selectedId() >= 0) return;

      this.onTermClick(terms[0].id);
    });

    // update parent
    effect(() => {
      this.onChange(this.selectedId() < 0 ? null : this.selectedId());
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      filter(params => !!params && !!params['termID']),
      map(params => Number(params['termID'])),
      filter(termID => !Number.isNaN(termID)),
      filter(termID => this.terms().some(term => term.id === termID)),
      tap(termID => this.selectedId.set(termID)),
      takeUntil(this.destroy$)
    ).subscribe();
  }



  // #ControlValueAccessor
  writeValue(obj: any): void {
    if (!obj) return;
    const id = Number(obj);
    if (Number.isNaN(id)) return;

    this.onTermClick(id);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  // /ControlValueAccessor

  protected isSelected(id?: number) {
    return this.selectedId() === id;
  }

  protected onTermClick(id?: number) {
    if (!id) return;

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { termID: id },
        queryParamsHandling: 'merge'
      }
    );
  }

  protected getCapacity(term: EventTermPublicDTO) {
    return this.capacities()[`${term.id}`];
  }

  protected getCapacityStatus(term: EventTermPublicDTO) {
    const capacity = this.capacities()[`${term.id}`];
    return capacity ? this.eventService.getCapacityStatus(capacity) : EventTermCapacityStatus.FREE;
  }

}
