import { Component, inject, input } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, take, tap } from 'rxjs';
import { HostControlArrayDirective } from '../../shared/directives/host-control-array.directive';
import { OverlayService } from '../../shared/service/overlay.service';
import { EnumSelectComponent } from '../../shared/form/enum-select/enum-select.component';
import { FormWithErrorsComponent } from '../../shared/form/form-with-errors/form-with-errors.component';

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
  styles: ``,
  hostDirectives: [ HostControlArrayDirective ]
})
export class EventConditionFormComponent {
  private hcad = inject(HostControlArrayDirective);

  constructor(
    private fb: NonNullableFormBuilder,
    private overlayService: OverlayService,
  ) {
  }

  protected get form() {
    return this.hcad.array;
  }

  protected get controls() {
    return this.form.controls as FormGroup[];
  }

  protected addCondition() {
    this.form.push(this.createForm());
  }

  protected removeCondition(event: Event, index: number) {
    this.overlayService.confirm("popup", event, "Naozaj chceš vymazať podmienku?", "", { acceptSeverity: 'danger' }).pipe(
      take(1),
      filter(result => result),
      tap(() => this.form.removeAt(index)),
    ).subscribe();
  }

  private createForm() {
    return this.fb.group({
      conditionType: this.fb.control<string | null>(null, Validators.required),
      minValue: this.fb.control(''),
      maxValue: this.fb.control(''),
      value: this.fb.control('')
    });
  }
}
