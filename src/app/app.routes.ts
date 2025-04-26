import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './registration/registration-form/registration-form.component';
import { RegistrationListComponent } from './registration/registration-list/registration-list.component';
import { InitGuard } from './shared/guards/init.guard';
import { UnavailableComponent } from './standalone/unavailable/unavailable.component';
import { NotFoundComponent } from './standalone/not-found/not-found.component';
import { RegistrationResultQueueComponent } from './registration/registration-result-queue/registration-result-queue.component';
import { RegistrationResultSuccessComponent } from './registration/registration-result-success/registration-result-success.component';
import { RegistrationConfirmComponent } from './registration/registration-confirm/registration-confirm.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [InitGuard],
    children: [
      { path: 'registration', component: RegistrationListComponent },
      { path: 'registration/:eventUUID', component: RegistrationFormComponent },
      { path: 'registration/result/queue', component: RegistrationResultQueueComponent },
      { path: 'registration/result/success', component: RegistrationResultSuccessComponent },
      { path: 'registration/confirm/:token', component: RegistrationConfirmComponent },
      { path: '', redirectTo: '/registration', pathMatch: 'full' },
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
