import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
  providers: [DecimalPipe]
})
export default class LoansComponent implements OnInit {
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  loans: any[] = [];

  ngOnInit() {
    this.loadLoans();
  }

  // 🔹 Cargar los préstamos desde `data.json`
  loadLoans() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        console.log('✅ JSON de préstamos cargado:', data);
        this.loans = data.prestamos;
      },
      error: (err) => {
        console.error('❌ Error al cargar JSON de préstamos:', err);
      }
    });
  }

  // 🔹 Método para calcular el total de préstamos PENDIENTES
  getTotalPendingLoans(): number {
    return this.loans
      .filter(loan => loan.estado === 'Pendiente') // ✅ Solo sumamos los préstamos pendientes
      .reduce((sum, loan) => sum + loan.valor, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // 🔹 Método para cambiar el estado del préstamo
  togglePaymentStatus(loan: any) {
    loan.estado = loan.estado === 'Pendiente' ? 'Pagado' : 'Pendiente';
  }
}
