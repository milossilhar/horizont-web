import { Routes } from '@angular/router';
import { EventFormComponent } from './event/event-form/event-form.component';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';
import { LoremIpsumComponent } from './shared/components/lorem-ipsum/lorem-ipsum.component';
import { InitGuard } from './shared/guards/init.guard';
import { UnavailableComponent } from './standalone/unavailable/unavailable.component';
import { NotFoundComponent } from './standalone/not-found/not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { DataComponent } from './shared/components/data/data.component';

export const routes: Routes = [
  // { path: '', redirectTo: '/event', pathMatch: 'full' },
  {
    path: '',
    canActivate: [InitGuard],
    component: SidebarLayoutComponent,
    children: [
      { path: 'dashboard', component: LoremIpsumComponent },
      {
        path: 'events',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: DataComponent, data: { component: 'events' } },
          { path: 'new', component: EventFormComponent }
        ]
      }
    ]
  },
  {
    path: '',
    children: [
      { path: 'unavailable', component: UnavailableComponent },
      { path: 'notfound', component: NotFoundComponent }
    ]
  },
  { path: '**', redirectTo: '/notfound'}
];
