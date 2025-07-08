import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { filter, map, of, switchMap, tap } from 'rxjs';
import { EnumerationRestService } from '../../../rest/api/enumeration.service';
import { EnumerationService } from '../../service/enumeration.service';
import { EnumerationName } from '../../types/enumeration-name';
import { markAllAsDirty } from '../../util/angular-utils';
import { FormWithErrorsComponent } from '../form-with-errors/form-with-errors.component';

type EnumFormType = FormGroup<{
  type: FormControl<string>,
  name: FormControl<string>,
  description: FormControl<string | null>,
  latitude?: FormControl<number | null>,
  longitude?: FormControl<number | null>
}>;

@Component({
  selector: 'app-enum-form',
  imports: [
    FormWithErrorsComponent,
    ReactiveFormsModule,
    InputText,
    InputNumber,
    FloatLabel,
    Button
  ],
  templateUrl: './enum-form.component.html',
  styles: ``
})
export class EnumFormComponent implements OnInit {

  @Input({ required: true })
  public enumName!: EnumerationName;

  protected form: EnumFormType;

  constructor(
    private fb: NonNullableFormBuilder,
    private enumerationRestService: EnumerationRestService,
    private enumerationService: EnumerationService,
    private dialogRef: DynamicDialogRef
  ) {
    this.form = this.fb.group({
      type: this.fb.control('item', Validators.required),
      name: this.fb.control('', [Validators.required, Validators.max(100)]),
      description: this.fb.control<string | null>('', [Validators.max(150)])
    });
  }

  ngOnInit(): void {
    if (this.enumName === 'REG_PLACE') {
      this.form.patchValue({ type: 'place' }, { emitEvent: false });
      this.form.addControl('latitude', this.fb.control<number | null>(null, Validators.required));
      this.form.addControl('longitude', this.fb.control<number | null>(null, Validators.required));
    }
  }

  protected onCloseClick() {
    this.dialogRef.close(undefined);
  }

  protected onSubmit() {
    this.form.updateValueAndValidity();
    markAllAsDirty(this.form);

    of(this.form.valid).pipe(
      filter(valid => valid),
      map(() => this.form.getRawValue()),
      switchMap(req => this.enumerationRestService.createEnumItem(this.enumName, req as any)),
      tap(item => this.enumerationService.created(this.enumName, item)),
      tap(item => this.dialogRef.close(item.code)),
    ).subscribe();
  }

  protected onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const text = clipboardData.getData('text');
    if (!text) return;

    if (this.form.contains('latitude') && this.form.contains('longitude')) {
      if (text.match(/^\d+.\d+\s*,\s*\d+.\d+$/)) {
        const [latitude, longitude] = text.split(',').map(s => parseFloat(s.trim()));
        this.form.patchValue({ latitude, longitude }, { emitEvent: false });
        return;
      }
    }
  }
}
