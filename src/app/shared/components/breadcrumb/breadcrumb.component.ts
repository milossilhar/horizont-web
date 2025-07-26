import { Component, computed, Signal } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { DestroyableComponent } from '../../base/destroyable.component';
import { BreadcrumbsService } from '../../service/breadcrumbs.service';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    Breadcrumb,
    RouterLink,
    SkeletonComponent
  ],
  templateUrl: './breadcrumb.component.html',
  styles: ``
})
export class BreadcrumbComponent extends DestroyableComponent {

  protected showBreadcrumbs = computed(() => this.breadcrumbService.breadcrumbs().length > 0);
  protected items: Signal<MenuItem[]> = computed(() => {
    return this.breadcrumbService
        .breadcrumbs()
        .map((breadcrumb, index) => {
          return {
            ...breadcrumb,
            last: index === this.breadcrumbService.breadcrumbs().length - 1 }
        })
    }
  );

  constructor(
    private breadcrumbService: BreadcrumbsService
  ) {
    super();
  }
}
