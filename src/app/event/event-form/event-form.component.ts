import { JsonPipe } from '@angular/common';
import { Component, computed, input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { filter, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { EventRestService } from '../../rest/api/event.service';
import { DestroyableComponent } from '../../shared/base/destroyable.component';
import { EnumSelectComponent } from '../../shared/form/enum-select/enum-select.component';
import { EventConditionFormComponent } from '../../shared/form/event-condition-form/event-condition-form.component';
import { EventTermFormComponent } from '../../shared/form/event-term-form/event-term-form.component';
import { FormWithErrorsComponent } from '../../shared/form/form-with-errors/form-with-errors.component';
import { ShownAsType } from '../../shared/types/shown-as.type';
import { markAllAsDirty } from '../../shared/util/angular-utils';

@Component({
  selector: 'app-event-form',
  imports: [
    FloatLabel,
    InputText,
    ReactiveFormsModule, FormWithErrorsComponent, Button, EnumSelectComponent, JsonPipe, DatePicker, EventConditionFormComponent, EventTermFormComponent
  ],
  templateUrl: './event-form.component.html',
  styles: ``
})
export class EventFormComponent extends DestroyableComponent implements OnInit {

  protected form;

  protected registrationEndsMinDate: Date | null = null;

  public shownAs = input<ShownAsType>('standalone');
  public onSuccess = input<() => void>(() => {});

  protected standalone = computed(() => this.shownAs() === 'standalone');

  constructor(
    private fb: NonNullableFormBuilder,
    private eventRestService: EventRestService
  ) {
    super();

    this.form = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.maxLength(200)]),
      details: this.fb.control('', [Validators.required, Validators.maxLength(2000)]),
      eventType: this.fb.control<string | null>(null, Validators.required),
      registrationStarts: this.fb.control<Date | null>(null, Validators.required),
      registrationEnds: this.fb.control<Date | null>(null, Validators.required),
      placeCode: this.fb.control<string | null>(null, Validators.required),
      periodCode: this.fb.control<string | null>(null),
      conditions: this.fb.array([]),
      terms: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.form.controls.registrationStarts.valueChanges.pipe(
      tap(v => this.registrationEndsMinDate = v),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  get request(): any {
    return this.form.getRawValue();
  }

  protected onSubmit() {
    this.form.updateValueAndValidity();
    markAllAsDirty(this.form);

    of(this.form.valid).pipe(
      filter(value => !!value),
      map(() => this.request),
      switchMap(req => this.eventRestService.createEvent(req)),
      tap(() => this.onSuccess()()),
    ).subscribe();
  }
}
