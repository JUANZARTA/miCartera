import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { WalletService } from '../../services/wallet.service';
import { DebtService } from '../../services/debts.service';
import { LoanService } from '../../services/loans.service';
import { DateService } from '../../services/date.service';

import { WalletAccount } from '../../models/wallet.model';
import { Debt } from '../../models/debt.model';
import { Loan } from '../../models/loans.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent implements OnInit, OnDestroy {
  // Subscripción
  private dateSubscription: Subscription | undefined;

  // Datos
  wallet: WalletAccount[] = [];
  debts: Debt[] = [];
  loans: Loan[] = [];

  // Fecha
  currentYear: string = '';
  currentMonth: string = '';

  // Estado financiero
  saludFinanciera: 'positiva' | 'advertencia' | 'critica' = 'positiva';
  mensajeSaludFinanciera: string = '';

  constructor(
    private walletService: WalletService,
    private debtService: DebtService,
    private loanService: LoanService,
    private dateService: DateService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.dateSubscription = this.dateService.selectedDate$.subscribe(({ year, month }: { year: string, month: string }) => {
      if (year && month) {
        this.currentYear = year;
        this.currentMonth = month;
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    this.dateSubscription?.unsubscribe();
  }

  // ======================
  // Cargar datos
  // ======================
  loadData() {
    const userId = this.currentUser;
    if (!userId) return;

    this.walletService.getWallet(userId, this.currentYear, this.currentMonth).subscribe({
      next: (data: any) => {
        this.wallet = Object.entries(data || {}).map(([id, item]: [string, any]) => ({ id, ...item }));
        this.evaluarSaludFinanciera();
      }
    });

    this.debtService.getDebts(userId, this.currentYear, this.currentMonth).subscribe({
      next: (data: any) => {
        this.debts = Object.entries(data || {}).map(([id, item]: [string, any]) => ({ id, ...item }));
        this.evaluarSaludFinanciera();
      }
    });

    this.loanService.getLoans(userId, this.currentYear, this.currentMonth).subscribe({
      next: (data: any) => {
        this.loans = Object.entries(data || {}).map(([id, item]: [string, any]) => ({ id, ...item }));
        this.evaluarSaludFinanciera();
      }
    });
  }

  // ======================
  // Usuario actual
  // ======================
  get currentUser(): string {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.localId || '';
    }
    return '';
  }

  // ======================
  // Totales
  // ======================
  get totalWallet(): number {
    return this.wallet.reduce((sum, w) => sum + (w.valor || 0), 0);
  }

  get totalPendingDebts(): number {
    return this.debts.filter(d => d.estado === 'Pendiente').reduce((sum, d) => sum + (d.valor || 0), 0);
  }

  get totalPendingLoans(): number {
    return this.loans.filter(l => l.estado === 'Pendiente').reduce((sum, l) => sum + (l.valor || 0), 0);
  }

  // ======================
  // Evaluar salud financiera
  // ======================
  evaluarSaludFinanciera() {
    const totalCartera = this.totalWallet;
    const totalCompromisos = this.totalPendingDebts + this.totalPendingLoans;

    if (totalCartera > totalCompromisos) {
      this.saludFinanciera = 'positiva';
      this.mensajeSaludFinanciera = 'Finanzas saludables';
    } else if (totalCartera === totalCompromisos) {
      this.saludFinanciera = 'advertencia';
      this.mensajeSaludFinanciera = 'Presupuesto justo';
    } else {
      this.saludFinanciera = 'critica';
      this.mensajeSaludFinanciera = '¡Alerta! Tienes más compromisos que dinero disponible';
    }
  }

  // ======================
  // Nombre del mes
  // ======================
  nombreMes(m: string): string {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const index = parseInt(m) - 1;
    return meses[index] || '';
  }

  // ======================
  // Acción del botón flotante
  // ======================
  irAgregarRapido() {
    this.router.navigate(['/app/expense']);
  }
}
