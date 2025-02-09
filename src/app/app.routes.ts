import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            {
                path: 'home',
                loadComponent: () => import('./business/home/home.component')
            },
            {
                path: 'expense',
                loadComponent: () => import('./business/expense/expense.component')
            },
            {
                path: 'income',
                loadComponent: () => import('./business/income/income.component')
            },
            {
                path: 'wallet',
                loadComponent: () => import('./business/wallet/wallet.component')
            },
            {
                path: 'savings',
                loadComponent: () => import('./business/savings/savings.component')
            },
            {
                path: 'loans',
                loadComponent: () => import('./business/loans/loans.component')
            },
            {
                path: 'debts',
                loadComponent: () => import('./business/debts/debts.component')
            },

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }

        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
