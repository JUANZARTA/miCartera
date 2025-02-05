import { Routes } from '@angular/router';

// Importamos los componentes Standalone generados
import { HomeComponent } from './features/dashboard/home/home.component';
import { TransactionsComponent } from './features/dashboard/transactions/transactions.component';
import { WalletsComponent } from './features/dashboard/wallets/wallets.component';
import { ExpensesComponent } from './features/dashboard/expenses/expenses.component';
import { IncomeComponent } from './features/dashboard/income/income.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent }, // Pantalla de inicio
  { path: 'transactions', component: TransactionsComponent }, // Transacciones
  { path: 'wallets', component: WalletsComponent }, // Billeteras
  { path: 'expenses', component: ExpensesComponent}, // Gastos
  { path: 'income', component: IncomeComponent}, // Ingresos
  { path: 'login', component: LoginComponent }, // Login
  { path: 'register', component: RegisterComponent }, // Registro
];
