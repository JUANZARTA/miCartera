import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [CommonModule], // ✅ Importamos CommonModule para habilitar *ngFor y pipes
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css'],
  providers: [DecimalPipe] // ✅ Agregamos DecimalPipe para formatear valores
})
export default class DebtsComponent {
  constructor(private decimalPipe: DecimalPipe) {}

  // 🔹 Lista de deudas
  debts = [
    { creditor: 'Banco XYZ', debtDate: '2024-01-10', paymentDate: '2024-03-10', value: 1200000, paid: false },
    { creditor: 'Juan López', debtDate: '2024-02-05', paymentDate: '2024-04-05', value: 600000, paid: true },
    { creditor: 'Prestamista Local', debtDate: '2024-03-20', paymentDate: '2024-05-20', value: 350000, paid: false }
  ];

  // 🔹 Método para calcular el total de deudas PENDIENTES
  getTotalPendingDebts(): number {
    return this.debts
      .filter(debt => !debt.paid) // ✅ Solo sumamos las deudas que no están pagadas
      .reduce((sum, debt) => sum + debt.value, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // 🔹 Método para cambiar el estado de la deuda
  togglePaymentStatus(debt: any) {
    debt.paid = !debt.paid;
  }
}
