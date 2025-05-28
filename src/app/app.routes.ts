import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './registration/registration-form/registration-form.component';
import { RegistrationListComponent } from './registration/registration-list/registration-list.component';
import { InitGuard } from './shared/guards/init.guard';
import { UnavailableComponent } from './standalone/unavailable/unavailable.component';
import { NotFoundComponent } from './standalone/not-found/not-found.component';
import { RegistrationResultQueueComponent } from './registration/registration-result-queue/registration-result-queue.component';
import { RegistrationResultSuccessComponent } from './registration/registration-result-success/registration-result-success.component';
import { RegistrationConfirmComponent } from './registration/registration-confirm/registration-confirm.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { EventListComponent } from './event/event-list/event-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/registration',
    pathMatch: 'full'
  },
  {
    path: '',
    canActivate: [InitGuard],
    children: [
      { path: 'event',
        canActivate: [AuthGuard],
        children: [
          { path: '', component: EventListComponent },
          { path: 'detail/:eventID', component: EventDetailComponent }
        ]
      },
      {
        path: 'registration',
        children: [
          { path: '', component: RegistrationListComponent },
          { path: ':eventUUID', component: RegistrationFormComponent },
          { path: 'result/queue', component: RegistrationResultQueueComponent },
          { path: 'result/success', component: RegistrationResultSuccessComponent },
          { path: 'confirm/:token', component: RegistrationConfirmComponent },
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
