import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { BehaviorSubject, combineLatest, filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { DestroyableComponent } from '../../base/destroyable.component';
import { EventService } from '../../service/event.service';
import { DataViewableService } from '../../types/data-viewable-service';
import { RegistrationService } from '../../service/registration.service';
import { PageableRequest } from '../../types/pageable-request';
import { RegistrationCardComponent } from '../../../registration/registration-card/registration-card.component';
import { JsonPipe } from '@angular/common';
import { EventCardComponent } from '../../../event/event-card/event-card.component';

interface Page {
  page: number;
  size: number;
}

interface Sort {
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

@Component({
  selector: 'app-data',
  imports: [
    DataViewModule,
    JsonPipe,
    EventCardComponent, RegistrationCardComponent
  ],
  templateUrl: './data.component.html',
  styles: ``
})
export class DataComponent extends DestroyableComponent {
  protected readonly DEFAULT_PAGE = 0;
  protected readonly DEFAULT_SIZE = 5;
  protected readonly DEFAULT_FIRST = this.DEFAULT_PAGE * this.DEFAULT_SIZE;
  protected readonly SIZE_OPTIONS = [5, 10, 20];

  protected data = signal<Array<any>>([]);
  protected component = signal<string>('');
  protected totalRecords = signal<number>(0);

  protected pagination = new BehaviorSubject<Page>({page: this.DEFAULT_PAGE, size: this.DEFAULT_SIZE});
  protected sorting = new BehaviorSubject<Sort>({sortField: 'id', sortOrder: 'asc'});


  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private registrationService: RegistrationService
  ) {
    super();

    combineLatest({
      component: this.route.params.pipe(map(params => params['component']), filter(c => !!c)),
      pagination: this.pagination.asObservable(),
      sorting: this.sorting.asObservable()
    }).pipe(
      tap(({component}) => this.component.set(component)),
      map(({component, pagination, sorting}) => ({
        service: this.mapComponent(component),
        pagination:  this.mapPaginationAndSorting(pagination, sorting)
      })),
      switchMap(({service, pagination}) => service.loadData(pagination)),
      tap(({content, total}) => {
        this.data.set(content);
        this.totalRecords.set(total);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  protected onPageUpdate(event: DataViewPageEvent) {
    const page: Page = {
      page: Math.round(event.first / event.rows),
      size: event.rows
    };
    this.pagination.next(page);
  }

  private mapComponent(name: string): DataViewableService {
    if (name === 'event') return this.eventService;
    if (name === 'registration') return this.registrationService;
    
    throw new Error(`Unrecognized component ${name}`);
  }

  private mapPaginationAndSorting(pagination: Page, sorting: Sort): PageableRequest {
    return {
      page: pagination.page,
      size: pagination.size,
      sort: [`${sorting.sortField},${sorting.sortOrder}`]
    }
  }

}
