import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { HostControlDirective } from '../../directives/host-control.directive';
import { SelectModule } from 'primeng/select';
import { OverlayService } from '../../service/overlay.service';
import { EnumerationService } from '../../service/enumeration.service';
import { MessageModule } from 'primeng/message';
import { filter, takeUntil, tap } from 'rxjs';
import { DestroyableComponent } from '../../base/destroyable.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Enumeration } from '../../types/enumeration';
import { EnumerationItem } from '../../types/enumeration-item';
import { EnumFormComponent } from '../enum-form/enum-form.component';
import { FormWithErrorsComponent } from '../form-with-errors/form-with-errors.component';

@Component({
  selector: 'app-enum-select',
  imports: [SelectModule, MessageModule, ReactiveFormsModule, FormWithErrorsComponent, Button, FloatLabel],
  templateUrl: './enum-select.component.html',
  styles: ``,
  hostDirectives: [HostControlDirective]
})
export class EnumSelectComponent extends DestroyableComponent implements OnInit {
  private hcd = inject(HostControlDirective);

  public enumName = input.required<string>();
  public inputId = input.required<string>();
  public label = input.required<string>();
  public errorMessages = input<Record<string, string>>();

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
      tap(e => this.values.set(e.values ?? [])),
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
}


