import { Routes } from '@angular/router';
import { JobListComponent } from '../app/joblist/joblist.component';
import { JobdetailsComponent } from '../app/jobdetails/jobdetails.component';

export const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobsDetails/:id', component: JobdetailsComponent },
];
