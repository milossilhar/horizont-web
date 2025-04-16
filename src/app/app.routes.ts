import { Routes } from '@angular/router';
import { RegistrationFormComponent } from './registration/registration-form/registration-form.component';
import { RegistrationListComponent } from './registration/registration-list/registration-list.component';

export const routes: Routes = [
  { path: 'registration', component: RegistrationListComponent,  },
  { path: 'registration/:eventUUID', component: RegistrationFormComponent },
  { path: '', redirectTo: '/registration', pathMatch: 'full' },
];
