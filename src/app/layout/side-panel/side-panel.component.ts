import { Component, input, model } from '@angular/core';
import { Avatar } from "primeng/avatar";
import { DividerModule } from 'primeng/divider';
import { OverlayBadge } from 'primeng/overlaybadge';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';
import { Params, RouterLink } from '@angular/router';
import { RedirectService } from '../../shared/service/redirect.service';
import { NavigationLinkComponent } from '../../shared/components/navigation-link/navigation-link.component';

type NavigationItem = {
  label: string;
  href: string;
  icon: string;
  params?: Params | null;
}

@Component({
  selector: 'app-side-panel',
  imports: [
    Avatar,
    DividerModule,
    UserAvatarComponent,
    OverlayBadge,
    RouterLink,
    NavigationLinkComponent
  ],
  templateUrl: './side-panel.component.html',
  styles: ``,
  host: {
    class: 'flex'
  }
})
export class SidePanelComponent {

  public collapsed = input.required<boolean>();

  protected navigationItems: {top: NavigationItem[], bottom: NavigationItem[]} = {
    top: [
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
    ],
    bottom: [
      {
        label: 'Nastavenia',
        href: '/settings',
        icon: 'pi-cog'
      },
      {
        label: 'Návrat na stránku',
        href: '',
        icon: 'pi-home',
      }
    ]
  }

  constructor(
    protected redirectService: RedirectService
  ) {
  }
}
