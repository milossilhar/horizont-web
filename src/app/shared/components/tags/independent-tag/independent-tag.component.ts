import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-independent-tag',
  imports: [TagModule],
  templateUrl: './independent-tag.component.html',
  styles: ``
})
export class IndependentTagComponent {

  public independent = input();

  public size = input<'small' | 'normal'>('normal');

  public isIndependent = computed(() => !!this.independent());

  get textClass() {
    switch(this.size()) {
      case 'small': return 'text-xs';
      case 'normal': return 'text-sm';
    }
  }

}
