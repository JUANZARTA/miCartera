import { Routes } from '@angular/router';

export const routes: Routes = [
    // Rutas de Autenticación (SIN LAYOUT)
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component')
    },

    // Rutas Protegidas dentro del Layout
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            { path: 'home', loadComponent: () => import('./business/home/home.component') },
            { path: 'expense', loadComponent: () => import('./business/expense/expense.component') },
            { path: 'income', loadComponent: () => import('./business/income/income.component') },
            { path: 'wallet', loadComponent: () => import('./business/wallet/wallet.component') },
            { path: 'savings', loadComponent: () => import('./business/savings/savings.component') },
            { path: 'loans', loadComponent: () => import('./business/loans/loans.component') },
            { path: 'debts', loadComponent: () => import('./business/debts/debts.component') },
            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },

    // Redirección para rutas no encontradas
    { path: '**', redirectTo: 'home' }
];
