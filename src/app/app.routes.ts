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
        loadComponent: () => import('./auth/login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component')
    },

    // Rutas protegidas dentro del layout
    {
        path: 'app', // Prefijo para las rutas protegidas
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            { path: 'home', loadComponent: () => import('./page/home/home.component') },
            { path: 'expense', loadComponent: () => import('./page/expense/expense.component') },
            { path: 'income', loadComponent: () => import('./page/income/income.component') },
            { path: 'wallet', loadComponent: () => import('./page/wallet/wallet.component') },
            { path: 'saving', loadComponent: () => import('./page/savings/savings.component') },
            { path: 'loan', loadComponent: () => import('./page/loans/loans.component') },
            { path: 'debt', loadComponent: () => import('./page/debts/debts.component') },
            { path: '', redirectTo: 'home', pathMatch: 'full' } // Ahora redirige a 'app/home'
        ]
    },

    // Redirección para rutas no encontradas
    { path: '**', redirectTo: 'login' }


];
