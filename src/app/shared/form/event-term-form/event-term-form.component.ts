import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { HostControlArrayDirective } from '../../directives/host-control-array.directive';
import { OverlayService } from '../../service/overlay.service';
import { EnumSelectComponent } from '../enum-select/enum-select.component';
import { FormWithErrorsComponent } from '../form-with-errors/form-with-errors.component';

@Component({
  selector: 'app-event-term-form',
  imports: [
    Button,
    EnumSelectComponent,
    FloatLabel,
    FormWithErrorsComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule
  ],
  templateUrl: './event-term-form.component.html',
  styles: ``,
  hostDirectives: [ HostControlArrayDirective ]
})
export class EventTermFormComponent {
  private hcd = inject(HostControlArrayDirective);

  constructor(
    private fb: NonNullableFormBuilder,
    private overlayService: OverlayService,
  ) {
  }

  protected get form() {
    return this.hcd.array;
  }

  protected get controls() {
    return this.form.controls as FormGroup[];
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
