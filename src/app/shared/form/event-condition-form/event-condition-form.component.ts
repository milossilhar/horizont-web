import { Component, input } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, take, tap } from 'rxjs';
import { OverlayService } from '../../service/overlay.service';
import { EnumSelectComponent } from '../enum-select/enum-select.component';
import { FormWithErrorsComponent } from '../form-with-errors/form-with-errors.component';

@Component({
  selector: 'app-event-condition-form',
  imports: [
    ReactiveFormsModule,
    Button,
    FormWithErrorsComponent,
    FloatLabel,
    InputText,
    EnumSelectComponent
  ],
  templateUrl: './event-condition-form.component.html',
  styles: ``
})
export class EventConditionFormComponent {

  public formArray = input.required<FormArray>();

  constructor(
    private fb: NonNullableFormBuilder,
    private overlayService: OverlayService,
  ) {
  }

  protected get controls() {
    return this.formArray().controls as FormGroup[];
  }

  protected addCondition() {
    this.formArray().push(this.createForm());
  }

  protected removeCondition(event: Event, index: number) {
    this.overlayService.confirm("popup", event, "Naozaj chceš vymazať podmienku?", "", { acceptSeverity: 'danger' }).pipe(
      take(1),
      filter(result => result),
      tap(() => this.formArray().removeAt(index)),
    ).subscribe();
  }

  createForm() {
    return this.fb.group({
      conditionType: this.fb.control<string | null>(null, Validators.required),
      minValue: this.fb.control(''),
      maxValue: this.fb.control(''),
      value: this.fb.control('')
    });
  }
}
