import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputNumber } from 'primeng/inputnumber';
import { filter, take, tap } from 'rxjs';
import { HostControlArrayDirective } from '../../directives/host-control-array.directive';
import { OverlayService } from '../../service/overlay.service';
import { LabelValue } from '../../types/label-value';
import { EnumSelectComponent } from '../enum-select/enum-select.component';
import { FormWithErrorsComponent } from '../form-with-errors/form-with-errors.component';
import { UserSelectComponent } from '../user-select/user-select.component';

type TermFormType = FormGroup<{
  repeatType: FormControl<string | null>,
  durationMinutes: FormControl<number>,
  expectedTrainers: FormControl<string[] | null>,
  deposit: FormControl<number | null>,
  price: FormControl<number>,
  capacity: FormControl<number>,
  hasAttendance: FormControl<boolean>

  // ONCE
  start?: FormControl<Date | null>,

  // DAILY, WEEKLY
  period?: FormControl<Date | null>,
  startTime?: FormControl<Date | null>,

  // WEEKLY
  dayOfWeek?: FormControl<string | null>
}>;

@Component({
  selector: 'app-event-term-form',
  imports: [
    Button, EnumSelectComponent, FloatLabel, FormWithErrorsComponent, ReactiveFormsModule, DatePicker, JsonPipe, InputNumber, InputGroup,
    InputGroupAddon,
    UserSelectComponent
  ],
  templateUrl: './event-term-form.component.html',
  styles: ``,
  hostDirectives: [HostControlArrayDirective]
})
export class EventTermFormComponent {
  private hcd = inject(HostControlArrayDirective);

  protected readonly durationOptions: LabelValue<string, number>[] = [
    { label: '30min', value: 30 },
    { label: '45min', value: 45 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: 'Celý deň', value: 480 },
  ];

  constructor(
    private fb: NonNullableFormBuilder,
    private overlayService: OverlayService,
  ) {
  }

  protected get form() {
    return this.hcd.array;
  }

  protected get controls() {
    return this.form.controls as TermFormType[];
  }

  protected addTerm() {
    this.controls.push(this.createForm());
  }

  protected removeTerm(event: Event, index: number) {
    this.overlayService.confirm('popup', event, 'Naozaj chceš vymazať termín?', '', { acceptSeverity: 'danger' }).pipe(
      take(1),
      filter(result => result),
      tap(() => this.form.removeAt(index)),
    ).subscribe();
  }

  protected onRepeatTypeChange(event: string, index: number) {
    if (event === 'ONCE') {
      this.removeControl(index, 'period');
      this.removeControl(index, 'startTime');
      this.removeControl(index, 'dayOfWeek');
      this.addStartControl(index);
    } else if (event === 'DAILY') {
      this.addPeriodControl(index);
      this.addStartTimeControl(index);
      this.removeControl(index, 'dayOfWeek');
      this.removeControl(index, 'start');
    } else if (event === 'WEEKLY') {
      this.addPeriodControl(index);
      this.addStartTimeControl(index);
      this.addDayOfWeekControl(index);
      this.removeControl(index, 'start');
    }
  }

  protected getPriceLabel(repeatType: string) {
    if (repeatType === 'ONCE') {
      return 'Cena';
    } else if (repeatType === 'DAILY') {
      return 'Cena';
    } else if (repeatType === 'WEEKLY') {
      return 'Cena za hodinu';
    }
    return '';
  }

  private createForm(): TermFormType {
    return this.fb.group({
      repeatType: this.fb.control<string | null>(null, Validators.required),
      durationMinutes: this.fb.control(0, [Validators.required, Validators.min(1), Validators.max(1440)]),
      expectedTrainers: this.fb.control<string[] | null>(null),
      deposit: this.fb.control<number | null>(null),
      price: this.fb.control<number>(0, [Validators.required, Validators.min(0)]),
      capacity: this.fb.control<number>(0, [Validators.required, Validators.min(0)]),
      hasAttendance: this.fb.control(false, Validators.required)
    });
  }

  private addStartControl(index: number) {
    if (!this.hasControl(index, 'start')) {
      this.controls[index].addControl('start', this.fb.control<Date | null>(null, Validators.required));
    }
  }

  private addStartTimeControl(index: number) {
    if (!this.hasControl(index, 'startTime')) {
      this.controls[index].addControl('startTime', this.fb.control<Date | null>(null, Validators.required));
    }
  }

  private addPeriodControl(index: number) {
    if (!this.hasControl(index, 'period')) {
      this.controls[index].addControl('period', this.fb.control<Date | null>(null, Validators.required));
    }
  }

  private addDayOfWeekControl(index: number) {
    if (!this.hasControl(index, 'dayOfWeek')) {
      this.controls[index].addControl('dayOfWeek', this.fb.control<string | null>(null, Validators.required));
    }
  }

  private removeControl(index: number, controlName: string) {
    if (this.hasControl(index, controlName)) {
      this.controls[index].removeControl(controlName as any);
    }
  }

  private hasControl(index: number, controlName: string) {
    return !!this.controls[index].get(controlName);
  }
}
