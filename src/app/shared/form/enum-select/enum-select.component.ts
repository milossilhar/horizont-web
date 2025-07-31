import { booleanAttribute, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectButton } from 'primeng/selectbutton';
import { HostControlDirective } from '../../directives/host-control.directive';
import { SelectModule } from 'primeng/select';
import { OverlayService } from '../../service/overlay.service';
import { EnumerationService } from '../../service/enumeration.service';
import { MessageModule } from 'primeng/message';
import { filter, map, takeUntil, tap } from 'rxjs';
import { includes, map as lodashMap } from 'lodash-es';
import { DestroyableComponent } from '../../base/destroyable.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Enumeration } from '../../types/enumeration';
import { EnumerationItem } from '../../types/enumeration-item';
import { EnumFormComponent } from '../enum-form/enum-form.component';
import { FormWithErrorsComponent } from '../form-with-errors/form-with-errors.component';

@Component({
  selector: 'app-enum-select',
  imports: [SelectModule, MessageModule, ReactiveFormsModule, FormWithErrorsComponent, Button, FloatLabel, SelectButton],
  templateUrl: './enum-select.component.html',
  styles: ``,
  hostDirectives: [HostControlDirective]
})
export class EnumSelectComponent extends DestroyableComponent implements OnInit {
  private hcd = inject(HostControlDirective);

  // inputs - required
  public enumName = input.required<string>();
  public inputId = input.required<string>();
  public label = input.required<string>();
  // inputs - optional
  public showLabel = input(false, { transform: booleanAttribute });
  public type = input<'select' | 'selectbutton'>('select');
  public defaulting = input(false, { transform: booleanAttribute });
  public disabledValues = input<string[]>([]);
  // inputs - passthrough
  public errorMessages = input<Record<string, string>>();
  public hint = input<string>();

  public onChange = output<string>();

  protected enumeration = signal<Enumeration | undefined>(undefined);
  protected values = signal<Array<EnumerationItem>>([]);

  constructor(
    private enumerationService: EnumerationService,
    private overlayService: OverlayService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.enumerationService.getEnum$(this.enumName()).pipe(
      tap(e => this.enumeration.set(e)),
      map(e => lodashMap(e.values ?? [], v => ({...v, disabled: includes(this.disabledValues(), v.code)}))),
      tap(e => this.values.set(e)),
      tap(() => this.setDefaultValue()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  protected get form() {
    return this.hcd.control;
  }

  protected onAddClick() {
    if (!this.enumeration()?.administrated) return;

    this.overlayService.open(EnumFormComponent, { enumName: this.enumName() }).pipe(
      filter(result => !!result),
      tap(code => this.hcd.control.setValue(code, { emitEvent: false })),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  protected setDefaultValue() {
    if (!this.defaulting()) return;
    if (!!this.form.value) return;
    if (this.values().length === 0) return;

    const defaultValue = this.values()[0].code;
    if (!defaultValue) return;

    this.form.setValue(defaultValue);
    this.onChange.emit(defaultValue);
  }
}


