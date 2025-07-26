import { Component, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { Drawer } from 'primeng/drawer';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { BehaviorSubject, combineLatest, map, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { DestroyableComponent } from '../../base/destroyable.component';
import { RedirectService } from '../../service/redirect.service';
import { LayoutType } from '../../types/layout-type';
import { Page } from '../../types/page';
import { PageableRequest } from '../../types/pageable-request';
import { NgComponentOutlet } from '@angular/common';
import { ToastService } from '../../service/toast.service';
import { Sort } from '../../types/sort';
import { SortOption } from '../../types/sort-option';
import { pageConvert } from '../../util/primeng-utils';
import { FilterComponent } from '../filter/filter.component';
import { ConfigEntryType, ConfigType, createDataConfig } from './data.config';

@Component({
  selector: 'app-data',
  imports: [
    DataViewModule, NgComponentOutlet, ReactiveFormsModule, SelectButton, FilterComponent, Select, Button, Drawer
  ],
  templateUrl: './data.component.html',
  styles: ``
})
export class DataComponent extends DestroyableComponent {
  protected readonly DEFAULT_PAGE = 0;
  protected readonly DEFAULT_SIZE = 5;
  protected readonly DEFAULT_FIRST = this.DEFAULT_PAGE * this.DEFAULT_SIZE;
  protected readonly SIZE_OPTIONS = [5, 10, 20];
  protected readonly LAYOUT_OPTIONS = [
    { value: 'list', icon: 'pi pi-list' },
    { value: 'grid', icon: 'pi pi-th-large' }
  ];

  private readonly CONFIG: ConfigType;

  protected currentComponentName?: string;
  protected currentConfig?: ConfigEntryType;

  protected data = signal<Array<any>>([]);
  protected totalRecords = signal<number>(0);

  protected pagination = new BehaviorSubject<Page>({ page: this.DEFAULT_PAGE, size: this.DEFAULT_SIZE });

  protected sortOptions: Array<SortOption> = [];

  protected layoutForm;
  protected sortForm;

  protected visibleDrawer = false;

  constructor(
    private route: ActivatedRoute,
    private redirectService: RedirectService,
    private fb: NonNullableFormBuilder,
    private toastService: ToastService
  ) {
    super();

    this.CONFIG = createDataConfig();
    this.layoutForm = this.fb.control<LayoutType>('list');
    this.sortForm = this.fb.control<Sort | undefined>(undefined);

    combineLatest({
      componentName: this.route.data.pipe(map(data => data['component'] as string)),
      pagination: this.pagination.asObservable(),
      sorting: this.sortForm.valueChanges.pipe(startWith(undefined))
    }).pipe(
      map(({ componentName, pagination, sorting }) => {
        if (this.currentComponentName !== componentName) {
          this.currentComponentName = componentName;
          this.currentConfig = this.getConfig(componentName);
          this.sortOptions = this.currentConfig.service.sortingOptions();
        }

        // TypeScript has a problem with currentConfig being undefined, which it will be always after getConfig()
        const config = this.currentConfig as ConfigEntryType;

        return {
          service: config.service,
          pagination: this.mapPaginationAndSorting(pagination, sorting)
        };
      }),
      switchMap(({ service, pagination }) => service.loadData(pagination)),
      tap(({ content, total }) => {
        this.data.set(content);
        this.totalRecords.set(total);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  protected onPageUpdate(event: DataViewPageEvent) {
    this.pagination.next(pageConvert(event));
  }

  protected onCreateNewClick() {
    this.visibleDrawer = true;
  }

  protected onDrawerClose() {
    this.visibleDrawer = false;
  }

  protected getSortIconClass(item: SortOption): string {
    const config = {
      'numeric': {
        'asc': 'pi pi-sort-numeric-up',
        'desc': 'pi pi-sort-numeric-down'
      },
      'date': {
        'asc': 'pi pi-sort-numeric-up-alt',
        'desc': 'pi pi-sort-numeric-down-alt'
      },
      'alpha': {
        'asc': 'pi pi-sort-alpha-up',
        'desc': 'pi pi-sort-alpha-down'
      },
      'amount': {
        'asc': 'pi pi-sort-amount-up',
        'desc': 'pi pi-sort-amount-down'
      }
    };
    return config[item.type][item.value.sortOrder];
  }

  private getConfig(name: string): ConfigEntryType {
    const config = this.CONFIG[name];
    if (!config) {
      this.toastService.error(`Neznámy komponent ${name}`, 'Chyba');
      this.redirectService.goTo('notfound');
      throw new Error(`Unrecognized component ${name}`);
    }
    return config;
  }

  private mapPaginationAndSorting(pagination: Page, sorting?: Sort): PageableRequest {
    return {
      page: pagination.page,
      size: pagination.size,
      sort: sorting ? [`${sorting.sortField},${sorting.sortOrder}`] : []
    }
  }
}
