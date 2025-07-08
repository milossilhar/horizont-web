import { JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { keys } from 'lodash';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { filter, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { DestroyableComponent } from '../../base/destroyable.component';
import { EnumSelectComponent } from '../../form/enum-select/enum-select.component';
import { DataViewableService } from '../../types/data-viewable-service';
import { FilterOption } from '../../types/filter-option';

@Component({
  selector: 'app-filter',
  imports: [
    Skeleton, Button, ReactiveFormsModule, EnumSelectComponent, JsonPipe
  ],
  templateUrl: './filter.component.html',
  styles: ``
})
export class FilterComponent extends DestroyableComponent {

  // inputs
  public service = input<DataViewableService>();

  // outputs
  // public filtersChanged = output<Array<Filter>>();

  protected form: FormGroup;
  protected filterOptions: Array<FilterOption> = [];

  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder
  ) {
    super();

    this.form = this.fb.group({});

    toObservable(this.service).pipe(
      filter(service => !!service),
      switchMap(service => service.filterOptions()),
      tap(options => this.filterOptions = options),
      tap(() => this.updateFormFromOptions()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private updateFormFromOptions(): void {
    if (this.subscription) this.subscription.unsubscribe();

    this.form = this.fb.group({});
    this.subscription = this.form.valueChanges.pipe(
      tap((value) => console.log(`new form value: ${JSON.stringify(value)}`)),
      takeUntil(this.destroy$)
    ).subscribe();

    this.filterOptions.forEach(option => {
      this.form.addControl(option.prop, this.fb.control<string | null>(null))
    });
  }

  protected get hasAnyValue(): boolean {
    return keys(this.form.value).some(key => !!this.form.value[key]);
  }

  public clearAllFilters(): void {
    this.form.reset();
  }
}
