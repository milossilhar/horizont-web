import { Component, input } from '@angular/core';
import { Params } from '@angular/router';
import { Button } from 'primeng/button';
import { NavigationLinkComponent } from '../../shared/components/navigation-link/navigation-link.component';

type NavigationItem = {
  label: string;
  href: string;
  icon: string;
  params?: Params | null;
}

@Component({
  selector: 'app-navigation',
  imports: [
    NavigationLinkComponent
  ],
  templateUrl: './navigation.component.html',
  styles: ``
})
export class NavigationComponent {

  public collapsed = input.required<boolean>();

  navigationItems: Array<NavigationItem> = [
    {
      label: 'Úvod',
      href: '/app',
      icon: 'pi-th-large'
    },
    {
      label: 'Udalosti',
      href: '/app/events',
      icon: 'pi-calendar'
    },
    {
      label: 'Registrácie',
      href: '/registrations',
      icon: 'pi-id-card'
    },
    {
      label: 'Hodiny',
      href: '/lessons',
      icon: 'pi-hourglass'
    }
  ];
}
