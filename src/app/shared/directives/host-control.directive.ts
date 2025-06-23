import { Directive, inject, Injector } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroup, NG_VALUE_ACCESSOR, NgControl, NgModel } from '@angular/forms';
import { DestroyableDirective } from '../base/destroyable.directive';
import { takeUntil, tap } from 'rxjs';

@Directive({
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: HostControlDirective
    }
  ]
})
export class HostControlDirective extends DestroyableDirective implements ControlValueAccessor {

  public control!: FormControl;

  private injector = inject(Injector);

  ngOnInit() {
    const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });

    if (ngControl instanceof NgModel) {
      this.control = ngControl.control;
      ngControl.control.valueChanges.pipe(
        tap(value => {
          if (ngControl.model !== value || ngControl.viewModel !== value) {
            ngControl.viewToModelUpdate(value);
          }
        }),
        takeUntil(this.destroy$)
      ).subscribe();

    } else if (ngControl instanceof FormControlDirective) {
      this.control = ngControl.control;
    } else if (ngControl instanceof FormControlName) {
      const container = this.injector.get(ControlContainer).control as FormGroup;
      this.control = container.controls[ngControl.name ?? ''] as FormControl;
    } else {
      this.control = new FormControl();
    }
  }

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
  
}
