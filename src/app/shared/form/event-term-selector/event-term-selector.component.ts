import { Component, forwardRef, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, filter, map, takeUntil, tap } from 'rxjs';
import { Destroyable } from '../../base/destroyable';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { EventTermPublicDTO } from '../../../rest/model/event-term-public';
import { EventHorizontService } from '../../../rest/api/event.service';

@Component({
  selector: 'app-event-term-selector',
  imports: [
    AsyncPipe, DatePipe, CurrencyPipe
  ],
  templateUrl: './event-term-selector.component.html',
  styles: ``,
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EventTermSelectorComponent),
      multi: true
    }]
})
export class EventTermSelectorComponent extends Destroyable implements ControlValueAccessor, OnInit, OnChanges {

  public eventUUID = input<string>();

  public terms = input.required<Array<EventTermPublicDTO>>();
  
  protected selectedIndex = new BehaviorSubject<number>(-1);
  protected disabled = new BehaviorSubject<boolean>(false);

  private onChange: (value?: number) => void = () => {};
  private onTouched = () => {};
  
  constructor(
    private eventHorizontService: EventHorizontService
  ) {
    super();
  }

  get validSelectIndex() {
    return this.selectedIndex.pipe(
      filter(i => i >= 0 && i < this.terms().length)
    );
  }

  get selectedTerm() {
    return this.validSelectIndex.pipe(
      map(i => this.terms()[i])
    );
  }
  
  ngOnInit(): void {
    // merge(timer(5000, 1000), this.validSelectIndex).pipe(
    //   throttleTime(10000),
    //   switchMap(() => this.eventHorizontService
    //     .getCurrentCapacities(this.eventUUID() ?? '')
    //     .pipe(
    //       catchError(() => of(undefined))
    //     )
    //   ),
    //   filter(val => !!val),
    //   tap(capacities => this.capacities = capacities),
    //   takeUntil(this.destroy$)
    // ).subscribe();

    this.selectedTerm.pipe(
      tap(term => this.selectedTermChanged(term)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('terms' in changes) {
      const { terms } = changes;
      const shouldSetDefaultTerm = !!terms.currentValue && !!terms.previousValue &&
        terms.currentValue.length > 0 &&
        terms.currentValue.length !== terms.previousValue.length;
      
      if (shouldSetDefaultTerm) {
        this.onTermClick(0);
      }
    }
  }

  writeValue(obj: any): void {
    if (!obj) return;

    const foundIndex = this.terms().findIndex(t => t.id === obj);
    this.selectedIndex.next(foundIndex);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.next(isDisabled);
  }

  protected onTermClick(index: number) {
    this.selectedIndex.next(index);
  }

  private selectedTermChanged(term: EventTermPublicDTO) {
    this.onChange(term.id);
  }

}
