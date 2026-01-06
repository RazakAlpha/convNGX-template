import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { ROUTES } from '../lib/constants';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing.component').then((m) => m.LandingComponent),
    pathMatch: 'full',
  },
  {
    path: ROUTES.SIGN_IN.slice(1),
    loadComponent: () =>
      import('./components/auth/signin.component').then((m) => m.SigninComponent),
    canActivate: [publicGuard],
  },
  {
    path: ROUTES.SIGN_UP.slice(1),
    loadComponent: () =>
      import('./components/auth/signup.component').then((m) => m.SignupComponent),
    canActivate: [publicGuard],
  },
  {
    path: ROUTES.CHAT.slice(1),
    loadComponent: () => import('./chat/chat.component').then((m) => m.ChatComponent),
    canActivate: [authGuard],
  },
  {
    path: ROUTES.DASHBOARD.slice(1),
    redirectTo: ROUTES.CHAT.slice(1),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
