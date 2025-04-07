// home.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../services/home.service';
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
export default class HomeComponent implements OnInit {
  // Servicios
  private homeService = inject(HomeService);

  // Modal de meses
  showMonthModal = false;
  months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  selectedMonth: number = new Date().getMonth();

  // Datos
  wallet: WalletAccount[] = [];
  debts: Debt[] = [];
  loans: Loan[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  // ======================
  // Cargar datos
  // ======================
  loadData() {
    this.homeService.getWallet().subscribe({
      next: (data) => this.wallet = data
    });
    this.homeService.getDebts().subscribe({
      next: (data) => this.debts = data
    });
    this.homeService.getLoans().subscribe({
      next: (data) => this.loans = data
    });
  }

  // ======================
  // Modal Mes
  // ======================
  openMonthModal() {
    this.showMonthModal = true;
  }

  closeMonthModal() {
    this.showMonthModal = false;
  }

  selectMonth(index: number) {
    this.selectedMonth = index;
    this.closeMonthModal();
  }

  // ======================
  // Totales
  // ======================
  get totalWallet(): number {
    return this.wallet.reduce((acc, item) => acc + (item.valor || 0), 0);
  }

  get totalPendingDebts(): number {
    return this.debts.filter(d => d.estado === 'Pendiente').reduce((acc, d) => acc + (d.valor || 0), 0);
  }

  get totalPendingLoans(): number {
    return this.loans.filter(l => l.estado === 'Pendiente').reduce((acc, l) => acc + (l.valor || 0), 0);
  }
}
