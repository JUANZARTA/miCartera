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
            { path: 'home', loadComponent: () => import('./features/home/home.component') },
            { path: 'expense', loadComponent: () => import('./features/expense/expense.component') },
            { path: 'income', loadComponent: () => import('./features/income/income.component') },
            { path: 'wallet', loadComponent: () => import('./features/wallet/wallet.component') },
            { path: 'savings', loadComponent: () => import('./features/savings/savings.component') },
            { path: 'loans', loadComponent: () => import('./features/loans/loans.component') },
            { path: 'debts', loadComponent: () => import('./features/debts/debts.component') },
            { path: 'account', loadComponent: () => import('./features/account/account.component') },
            { path: '', redirectTo: 'home', pathMatch: 'full' } // Ahora redirige a 'app/home'
        ]
    },

    // Redirección para rutas no encontradas
    { path: '**', redirectTo: 'login' }


];
