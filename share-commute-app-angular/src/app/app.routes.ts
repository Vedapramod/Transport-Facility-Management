import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AddRide } from './components/add-ride/add-ride';
import { PickRide } from './components/pick-ride/pick-ride';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: Dashboard,
    children: [
      { path: 'home', component: Home },
      { path: 'add-ride', component: AddRide },
      { path: 'pick-ride', component: PickRide },
      { path: '**', redirectTo: '/home' },
    ],
  },
];
