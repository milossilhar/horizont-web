import { Injectable, signal } from '@angular/core';
import { DestroyableService } from '../base/destroyable.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, takeUntil, tap } from 'rxjs';
import { uniqBy } from 'lodash';

type BreadcrumbType = {
  label?: string,
  icon?: string,
  loadingKey?: string,
  url: string
};

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService extends DestroyableService {

  private _cachedBreadcrumbs: Array<BreadcrumbType> = [];
  private _breadcrumbs = signal<Array<BreadcrumbType>>([]);

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    super();

    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => activatedRoute.root),
      map(root => this._createBreadcrumbs(root)),
      map(breadcrumbs => uniqBy(breadcrumbs, b => b.url)),
      tap(breadcrumbs => this._setBreadcrumbs(breadcrumbs)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  public setLoadedLabel(key: string, label: string) {
    this._cachedBreadcrumbs = this._cachedBreadcrumbs.map(breadcrumb => {
      if (breadcrumb.loadingKey === key) {
        breadcrumb.label = label;
        breadcrumb.loadingKey = undefined;
      }
      return breadcrumb;
    });

    this._breadcrumbs.set(this._cachedBreadcrumbs);
  }

  public get breadcrumbs() {
    return this._breadcrumbs;
  }

  private _setBreadcrumbs(breadcrumbs: Array<BreadcrumbType>) {
    this._cachedBreadcrumbs = breadcrumbs;
    this._breadcrumbs.set(breadcrumbs);
  }

  private _createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<BreadcrumbType> = []): Array<BreadcrumbType> {
    const urlSegment = route.snapshot.url.map(segment => segment.path).join('/');
    if (urlSegment) url += `/${urlSegment}`;
    if (route.snapshot.data['breadcrumb']) {
      const { breadcrumb } = route.snapshot.data;

      breadcrumbs.push({
        label: breadcrumb.label,
        icon: breadcrumb.icon,
        loadingKey: breadcrumb.loadingKey,
        url: url
      });
    }

    for(const child of route.children) {
      this._createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
