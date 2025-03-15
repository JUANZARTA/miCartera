import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent implements OnInit {
  // Inyección de dependencias
  private http = inject(HttpClient);

  // Variables para el modal de meses
  showMonthModal = false;
  months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  selectedMonth: number = new Date().getMonth();

  // Arreglos para almacenar los datos de los JSON
  wallet: any[] = [];
  debts: any[] = [];
  loans: any[] = [];

  ngOnInit(): void {
    this.loadWallet();
    this.loadDebts();
    this.loadLoans();
  }

  // Métodos del modal de meses
  openMonthModal() { this.showMonthModal = true; }
  closeMonthModal() { this.showMonthModal = false; }
  selectMonth(index: number) { this.selectedMonth = index; this.closeMonthModal(); }

  // Métodos para cargar los datos desde los JSON
  loadWallet() {
    this.http.get<any>('/assets/json/wallet.json').subscribe({
      next: (data) => { this.wallet = data.cartera; },
      error: (err) => { console.error('Error al cargar cartera:', err); }
    });
  }

  loadDebts() {
    this.http.get<any>('/assets/json/debts.json').subscribe({
      next: (data) => { this.debts = data.deudas; },
      error: (err) => { console.error('Error al cargar deudas:', err); }
    });
  }

  loadLoans() {
    this.http.get<any>('/assets/json/loans.json').subscribe({
      next: (data) => { this.loans = data.prestamos; },
      error: (err) => { console.error('Error al cargar préstamos:', err); }
    });
  }

  // Getters para calcular totales
  get totalWallet(): number {
    return this.wallet.reduce((acc, item) => acc + item.valor, 0);
  }

  get totalPendingDebts(): number {
    return this.debts
      .filter(debt => debt.estado === 'Pendiente')
      .reduce((acc, debt) => acc + (debt.valor || 0), 0);
  }

  get totalPendingLoans(): number {
    return this.loans
      .filter(loan => loan.estado === 'Pendiente')
      .reduce((acc, loan) => acc + loan.valor, 0);
  }
}
