import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-consent-tag',
  imports: [TagModule],
  templateUrl: './consent-tag.component.html',
  styles: ``
})
export class ConsentTagComponent {

  public consent = input();

  public hasConsent = computed(() => !!this.consent());

}
