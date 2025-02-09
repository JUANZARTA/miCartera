import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule], // ✅ Importamos CommonModule para habilitar *ngFor y pipes
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
  providers: [DecimalPipe] // ✅ Agregamos DecimalPipe para formatear valores
})
export default class LoansComponent {
  constructor(private decimalPipe: DecimalPipe) {}

  // 🔹 Lista de préstamos con su respectiva información
  loans = [
    { debtor: 'James Muñoz', loanDate: '2024-01-31', paymentDate: '2024-02-5', value: 31500, paid: false },
    { debtor: 'María González', loanDate: '2024-02-10', paymentDate: '2024-04-10', value: 750000, paid: true },
    { debtor: 'Carlos López', loanDate: '2024-03-05', paymentDate: '2024-05-05', value: 300000, paid: false }
  ];

  // 🔹 Método para calcular el total de préstamos pendientes
  getTotalPendingLoans(): number {
    return this.loans
      .filter(loan => !loan.paid) // ✅ Solo sumamos préstamos NO pagados
      .reduce((sum, loan) => sum + loan.value, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // 🔹 Método para cambiar el estado del préstamo
  togglePaymentStatus(loan: any) {
    loan.paid = !loan.paid;
  }
}
