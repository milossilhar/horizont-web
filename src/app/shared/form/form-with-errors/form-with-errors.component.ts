import { JsonPipe } from '@angular/common';
import { AfterContentInit, booleanAttribute, Component, ContentChild, input } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-form-with-errors',
  imports: [Message, JsonPipe],
  templateUrl: './form-with-errors.component.html',
  styles: ``
})
export class FormWithErrorsComponent implements AfterContentInit {
  @ContentChild(NgControl) ngControl?: NgControl;

  public errorMessages = input<Record<string, string>>();
  public showErrorsWhen = input<'touched' | 'dirty' | 'always'>('dirty');
  public hint = input<string>();
  public debug = input(false, { transform: booleanAttribute });

  protected control: AbstractControl | null = null;

  ngAfterContentInit(): void {
    if (this.ngControl && this.ngControl.control) {
      this.control = this.ngControl.control;
    }
  }

  get shouldShowErrors(): boolean {
    if (!this.control || !this.control.errors) {
      return false;
    }

    switch (this.showErrorsWhen()) {
      case 'always':
        return true;
      case 'dirty':
        return this.control.dirty;
      case 'touched':
      default:
        return this.control.touched;
    }
  }

  getErrorMessages(): string[] {
    if (!this.control?.errors) {
      return [];
    }

    const errors: string[] = [];
    const controlErrors = this.control.errors;

    Object.keys(controlErrors).forEach(errorKey => {
      const message = this.errorMessages()?.[errorKey];
      if (message) {
        errors.push(message);
      } else {
        // Fallback error messages
        errors.push(this.getDefaultErrorMessage(errorKey, controlErrors[errorKey]));
      }
    });

    return errors;
  }

  private getDefaultErrorMessage(errorKey: string, errorValue: any): string {
    const defaultMessages: { [key: string]: string } = {
      required: 'Toto pole je povinné',
      email: 'Prosím, zadaj platnú email adresu',
      min: `Hodnota musí byť minimálne  ${errorValue.min}`,
      max: `Hodnota nesmie byť väčššia ako ${errorValue.max}`,
      minlength: `Musí mať minimálne ${errorValue.requiredLength} znakov`,
      maxlength: `Môže mať maximálne ${errorValue.requiredLength} znakov`,
      pattern: 'Prosím zadaj údaje v správnom formáte'
    };

    return defaultMessages[errorKey] || 'Neplatný údaj';
  }
}
