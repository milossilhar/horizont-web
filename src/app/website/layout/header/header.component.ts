import { Component, computed, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MessageModule } from 'primeng/message';
import { HealthRestService } from '../../../rest/api/health.service';
import { distinctUntilChanged, filter, fromEvent, map, take, takeUntil, tap } from 'rxjs';
import { HttpContext } from '@angular/common/http';
import { IS_SILENT_REQUEST } from '../../../http/toast.interceptor';
import { DestroyableComponent } from '../../../shared/base/destroyable.component';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

const EXPANDED_TRESHOLD = 20;
const TAILWIND_LG_BREAKPOINT = 1024;

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    BreadcrumbModule,
    MenuModule,
    MessageModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent extends DestroyableComponent implements OnInit {

  protected expandedMenu = signal(false);
  protected expanded = signal(true);
  protected environment = signal<string | undefined>(undefined);
  protected isNotProd = computed(() => this.environment() && this.environment() !== 'prod');

  protected links = [
    { label: 'O Klube', routerLink: ['/home'], fragment: 'intro' },
    { label: 'Novinky', routerLink: ['/blog'] },
    { label: 'Galéria', routerLink: ['/home'], fragment: 'gallery' },
    { label: 'Tím', routerLink: ['/home'], fragment: 'team' },
  ];

  constructor(
    router: Router,
    private healthRestService: HealthRestService
  ) {
    super();

    fromEvent(window, 'resize').pipe(
      map(() => window.innerWidth),
      map(width => width >= TAILWIND_LG_BREAKPOINT),
      filter(lg => lg),
      tap(() => this.expandedMenu.set(false)),
      takeUntil(this.destroy$)
    ).subscribe();

    fromEvent(document, 'scroll').pipe(
      map(() => window.scrollY),
      map(y => y < EXPANDED_TRESHOLD),
      distinctUntilChanged(),
      tap(expanded => this.expanded.set(expanded)),
      takeUntil(this.destroy$)
    ).subscribe();

    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => this.expandedMenu.set(false)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnInit(): void {
    this.healthRestService.getEnvironment('body', false, { context: new HttpContext().set(IS_SILENT_REQUEST, true) }).pipe(
      tap(env => this.environment.set(env.value)),
    ).subscribe();
  }
}
