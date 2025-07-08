import { Component, computed, input } from '@angular/core';
import { Params, RouterLink, RouterLinkActive } from '@angular/router';
import { iconNormalizer } from '../../util/primeng-utils';

@Component({
  selector: 'app-navigation-link',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navigation-link.component.html',
  styles: ``
})
export class NavigationLinkComponent {

  public collapsed = input.required<boolean>();
  public label = input.required<string>();
  public routerLink = input.required<string>();
  public queryParams = input<Params | null | undefined>();
  public icon = input.required<string>();

  public primeNgIcon = computed(() => iconNormalizer(this.icon()));
}
