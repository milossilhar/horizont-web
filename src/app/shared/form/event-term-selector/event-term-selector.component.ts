import { Component, forwardRef, Injector, Input, OnChanges, OnInit, Self, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { EventTermDTO } from '../../../rest/model/event-term';
import { BehaviorSubject, concatMap, filter, map, startWith, Subject, take, takeUntil, tap } from 'rxjs';
import { Destroyable } from '../../base/destroyable';
import { AsyncPipe, DatePipe } from '@angular/common';
import { EventTermPublicDTO } from '../../../rest/model/event-term-public';

@Component({
  selector: 'app-event-term-selector',
  imports: [
    AsyncPipe, DatePipe
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
  
  @Input({ required: true })
  public terms: Array<EventTermPublicDTO> = [];
  
  protected selectedIndex = new BehaviorSubject<number>(-1);
  protected disabled = new BehaviorSubject<boolean>(false);

  private onChange: (value?: number) => void = () => {};
  private onTouched = () => {};
  
  constructor() {
    super();
  }
  
  ngOnInit(): void {
    this.selectedIndex.pipe(
      filter(i => i >= 0 && i < this.terms.length),
      map(i => this.terms[i]),
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

    const foundIndex = this.terms.findIndex(t => t.id === obj);
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
