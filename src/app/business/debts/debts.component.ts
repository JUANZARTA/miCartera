import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css'],
  providers: [DecimalPipe]
})
export default class DebtsComponent implements OnInit {
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  debts: any[] = [];

  ngOnInit() {
    this.loadDebts();
  }

  // 🔹 Cargar las deudas desde `data.json`
  loadDebts() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        console.log('✅ JSON de deudas cargado:', data);
        this.debts = data.deudas;
      },
      error: (err) => {
        console.error('❌ Error al cargar JSON de deudas:', err);
      }
    });
  }

  // 🔹 Método para calcular el total de deudas PENDIENTES
  getTotalPendingDebts(): number {
    return this.debts
      .filter(debt => debt.estado === 'Pendiente') // ✅ Solo sumamos las deudas que están pendientes
      .reduce((sum, debt) => sum + debt.valor, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // 🔹 Método para cambiar el estado de la deuda (si es pagada o no)
  togglePaymentStatus(debt: any) {
    debt.estado = debt.estado === 'Pendiente' ? 'Pagado' : 'Pendiente';
  }
}
