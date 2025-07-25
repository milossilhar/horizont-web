import { Routes } from '@angular/router';
import { EventFormComponent } from './event/event-form/event-form.component';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';
import { LoremIpsumComponent } from './shared/components/lorem-ipsum/lorem-ipsum.component';
import { InitGuard } from './shared/guards/init.guard';
import { UnavailableComponent } from './standalone/unavailable/unavailable.component';
import { NotFoundComponent } from './standalone/not-found/not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { DataComponent } from './shared/components/data/data.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { FullscreenLayoutComponent } from './layout/fullscreen-layout/fullscreen-layout.component';
import { WebHomeComponent } from './website/web-home/web-home.component';
import { WebLayoutComponent } from './layout/web-layout/web-layout.component';
import { WebBlogComponent } from './website/web-blog/web-blog.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'app',
    canActivate: [InitGuard],
    component: SidebarLayoutComponent,
    children: [
      { path: '', component: LoremIpsumComponent, data: { breadcrumb: { type: 'home', icon: 'pi pi-th-large' } } },
      {
        path: 'events',
        canActivate: [AuthGuard],
        data: { breadcrumb: { type: 'item', label: 'Udalosti' } },
        children: [
          { path: '', component: DataComponent, data: { component: 'events' } },
          { path: 'new', component: EventFormComponent, data: { breadcrumb: { type: 'item', label: 'Nová Udalosť' } } },
          { path: ':eventId',  component: EventDetailComponent, data: { breadcrumb: { type: 'loading', id: 'eventName' } } },
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
  { path: '**', redirectTo: '/notfound'}
];
