import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: 'customer/:id',
        loadComponent: () => import('./features/customer/customer-detail.component').then(m => m.CustomerDetailComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
