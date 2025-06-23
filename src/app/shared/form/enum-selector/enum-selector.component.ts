import { Component, inject, input, OnInit, signal } from '@angular/core';
import { HostControlDirective } from '../../directives/host-control.directive';
import { SelectModule } from 'primeng/select';
import { EnumerationService } from '../../service/enumeration.service';
import { MessageModule } from 'primeng/message';
import { takeUntil, tap } from 'rxjs';
import { DestroyableComponent } from '../../base/destroyable.component';
import { EnumerationItemPublicDTO } from '../../../rest/model/enumeration-item-public';
import { map } from 'lodash';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-enum-selector',
  imports: [ SelectModule, MessageModule, ReactiveFormsModule ],
  templateUrl: './enum-selector.component.html',
  styles: ``,
  hostDirectives: [ HostControlDirective ]
})
export class EnumSelectorComponent extends DestroyableComponent implements OnInit {
  private hcd = inject(HostControlDirective);

  public enumName = input.required<string>();
  public placeholder = input.required<string>();
  public errorMessages = input.required<Record<string, string>>();

  protected values = signal<Array<{ text: string, value: string }>>([]);
  
  constructor(
    private enumerationService: EnumerationService
  ) {
    super();
  }
  
  ngOnInit(): void {
    this.enumerationService.getEnum(this.enumName()).pipe(
      tap(enums => this.updateValues(enums)),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  
  protected get form() {
    return this.hcd.control;
  }
  
  protected hasError(errorCode: string): boolean {
    return this.hcd.control.dirty && this.hcd.control.hasError(errorCode);
  }

  private updateValues(enums: EnumerationItemPublicDTO[]): void {
    console.log('updating enum values: ', enums);
    this.values.set(
      map(enums, e => ({ text: e.description ?? e.code, value: e.code }))
    );
  }
}


