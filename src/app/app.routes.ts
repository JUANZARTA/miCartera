import { Routes } from '@angular/router';

export const routes: Routes = [
  // Rutas de Autenticación (SIN LAYOUT)
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.default)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.default)
  },

  // Rutas protegidas dentro del layout
  {
    path: 'app', // Prefijo para las rutas protegidas
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.default),
    children: [
      { path: 'home', loadComponent: () => import('./page/home/home.component').then(m => m.HomeComponent) },
      { path: 'expense', loadComponent: () => import('./page/expense/expense.component').then(m => m.default) },
      { path: 'income', loadComponent: () => import('./page/income/income.component').then(m => m.default) },
      { path: 'wallet', loadComponent: () => import('./page/wallet/wallet.component').then(m => m.default) },
      { path: 'saving', loadComponent: () => import('./page/savings/savings.component').then(m => m.default) },
      { path: 'loan', loadComponent: () => import('./page/loans/loans.component').then(m => m.default) },
      { path: 'debt', loadComponent: () => import('./page/debts/debts.component').then(m => m.default) },
      { path: '', redirectTo: 'home', pathMatch: 'full' } // Ahora redirige a 'app/home'
    ]
  },

  // Redirección para rutas no encontradas
  { path: '**', redirectTo: 'login' }
];
