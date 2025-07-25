import { Component } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { DestroyableComponent } from '../../base/destroyable.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    Breadcrumb
  ],
  templateUrl: './breadcrumb.component.html',
  styles: ``
})
export class BreadcrumbComponent extends DestroyableComponent {

  protected ROUTE_NAMES: Record<string, string> = {
    events: 'Udalosti',
    'new': 'Nový'
  }

  protected home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard' };
  protected items: MenuItem[] = [];

  constructor(router: Router) {
    super();
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects.split('/')),
      map(segments => segments.filter(s => !!s && s.toLowerCase() !== 'dashboard')),
      map(segments => segments.map((segment, index) => ({
        label: this.ROUTE_NAMES[segment] ?? segment.toUpperCase(),
        routerLink: index < segments.length - 1 ? `/${segment}` : undefined
      } as MenuItem))),
      tap(items => this.items = items),
      takeUntil(this.destroy$)
    ).subscribe();
  }
}
