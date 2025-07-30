import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { DataComponent } from './shared/components/data/data.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { EventFormComponent } from './event/event-form/event-form.component';
import { FullscreenLayoutComponent } from './layout/fullscreen-layout/fullscreen-layout.component';
import { InitGuard } from './shared/guards/init.guard';
import { LoremIpsumComponent } from './shared/components/lorem-ipsum/lorem-ipsum.component';
import { NotFoundComponent } from './standalone/not-found/not-found.component';
import { Routes } from '@angular/router';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';
import { UnavailableComponent } from './standalone/unavailable/unavailable.component';
import { WebBlogComponent } from './website/web-blog/web-blog.component';
import { WebHomeComponent } from './website/web-home/web-home.component';
import { WebLayoutComponent } from './layout/web-layout/web-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: '**', component: AuthComponent },
    ]
  },
  {
    path: 'app',
    canActivate: [ AuthGuard, InitGuard ],
    component: SidebarLayoutComponent,
    data: { breadcrumb: { label: 'Domov', icon: 'pi pi-home' } },
    children: [
      { path: '', component: LoremIpsumComponent },
      {
        path: 'events',
        data: { breadcrumb: { label: 'Udalosti' } },
        children: [
          { path: '', component: DataComponent, data: { component: 'events' } },
          { path: 'new', component: EventFormComponent, data: { breadcrumb: { label: 'Nová Udalosť' } } },
          { path: ':eventId', component: EventDetailComponent, data: { breadcrumb: { loadingKey: 'eventName' } } },
        ]
      }
    ]
  },
  {
    path: '',
    component: WebLayoutComponent,
    children: [
      { path: 'home', component: WebHomeComponent },
      { path: 'blog', component: WebBlogComponent },
    ]
  },
  {
    path: '',
    component: FullscreenLayoutComponent,
    children: [
      { path: 'unavailable', component: UnavailableComponent },
      { path: 'notfound', component: NotFoundComponent }
    ]
  },
  { path: '**', redirectTo: '/notfound' }
];
