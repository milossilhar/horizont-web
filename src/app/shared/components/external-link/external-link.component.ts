import { Component, input } from '@angular/core';

export type ExternalLinkType = 'email' | 'tel';

@Component({
  selector: 'app-external-link',
  imports: [],
  templateUrl: './external-link.component.html',
  styles: ``
})
export class ExternalLinkComponent {

  public value = input.required<string | undefined | null>();

  public type = input.required<ExternalLinkType>();

  get href() {
    switch(this.type()) {
      case 'email':
        return `mailto:${this.value()}`;
      case 'tel':
        return `tel:${this.value()}`;
      default:
        return '_blank';
    }
  }
}
