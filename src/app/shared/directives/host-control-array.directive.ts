import { Directive, inject, Injector } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormArray, FormArrayName,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  standalone: true,
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: HostControlArrayDirective
  }]
})
export class HostControlArrayDirective implements ControlValueAccessor {

  public array!: FormArray;

  private injector = inject(Injector);

  ngOnInit() {
    const controlContainer = this.injector.get(ControlContainer, null, { self: true, optional: true });

    if (controlContainer instanceof FormArrayName) {
      this.array = controlContainer.control as FormArray;
    } else {
      this.array = new FormArray<any>([]);
    }
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
}
