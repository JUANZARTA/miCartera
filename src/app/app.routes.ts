import { Routes } from '@angular/router';

// Importamos los componentes Standalone generados
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/dashboard/home/home.component';
import { TransactionsComponent } from './features/dashboard/transactions/transactions.component';
import { WalletsComponent } from './features/dashboard/wallets/wallets.component';
import { ExpensesComponent } from './features/dashboard/expenses/expenses.component';
import { IncomeComponent } from './features/dashboard/income/income.component';
import { SavingsComponent } from './features/dashboard/savings/savings.component';
import { LoansComponent } from './features/dashboard/loans/loans.component';
import { DebtsComponent } from './features/dashboard/debts/debts.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login
  { path: 'register', component: RegisterComponent }, // Registro
  { path: 'home', component: HomeComponent }, // Pantalla de inicio
  { path: 'transactions', component: TransactionsComponent }, // Transacciones
  { path: 'wallets', component: WalletsComponent }, // Billeteras
  { path: 'expenses', component: ExpensesComponent}, // Gastos
  { path: 'income', component: IncomeComponent}, // Ingresos
  { path: 'savings', component: SavingsComponent}, // Ahorros
  { path: 'loans', component: LoansComponent}, // Prestamos
  { path: 'debts', component: DebtsComponent}, // Deudas
  
];
