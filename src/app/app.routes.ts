import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signin',
    loadComponent: () =>
      import('./components/auth/signin.component').then((m) => m.SigninComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/auth/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: '',
    redirectTo: '/signin',
    pathMatch: 'full',
  },
];
