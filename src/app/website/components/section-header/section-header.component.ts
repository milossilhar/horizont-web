import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  imports: [],
  templateUrl: './section-header.component.html',
  styles: ``
})
export class SectionHeaderComponent {
  public header = input.required<string>();
  public subheader = input<string>();
}
