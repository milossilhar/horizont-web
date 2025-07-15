import { Component, effect, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, tap } from 'rxjs';
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
export class EventTermSelectorComponent extends DestroyableComponent implements ControlValueAccessor {

  protected EventTermCapacityStatus = EventTermCapacityStatus;

  public terms = input.required<Array<EventTermPublicDTO>>();

  public eventUUID = input<string>();

  // shows selector as admin panel
  public showAdmin = input<boolean>(false);

  protected selectedId = signal<number>(-1);
  protected disabled = signal<boolean>(false);
  protected capacities = signal<Dictionary<EventTermCapacityResponsePublicDTO>>({});

  private queryParams = signal<Record<string, string>>({});

  private onChange: (value?: number | null) => void = () => {};
  private onTouched = () => {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private publicHorizontService: PublicHorizontService
  ) {
    super();

    this.activatedRoute.queryParams.pipe(
      tap(params => this.queryParams.set(params)),
      takeUntil(this.destroy$)
    ).subscribe();

    // load capacities for the Event when input gets set
    effect(() => {
      const eventUUID = this.eventUUID();
      if (!eventUUID) return;

      this.publicHorizontService.getEventCapacities(eventUUID).pipe(
        tap(capacities => this.capacities.set(capacities)),
        takeUntil(this.destroy$)
      ).subscribe();
    });

    // update parent
    effect(() => {
      if (this.selectedId() < 0) return;
      this.onChange(this.selectedId());
    });

    effect(() => {
      if (!this.terms().length) return;

      if (!this.queryParams()['termID']) return this.setDefault();

      const id = Number(this.queryParams()['termID']);
      if (Number.isNaN(id)) return this.setDefault();
      if (!this.terms().some(term => term.id === id)) return this.setDefault();

      this.selectedId.set(id);
    });
  }

  // #ControlValueAccessor
  writeValue(obj: any): void {
    if (!obj) return;
    const id = Number(obj);
    if (Number.isNaN(id)) return;

    console.log('writeValue', id);
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
    console.log('onTermClick', id);
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

  private setDefault() {
    const terms = this.terms();
    if (!terms.length) return;
    if (this.selectedId() >= 0) return; // not override

    const firstTerm = terms[0];
    this.onTermClick(firstTerm.id);
  }

}
