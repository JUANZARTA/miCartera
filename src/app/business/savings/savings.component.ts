import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule], // ✅ Importamos CommonModule para habilitar *ngFor y pipes
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css'],
  providers: [DecimalPipe] // ✅ Agregamos DecimalPipe para formatear valores
})
export default class SavingsComponent {
  constructor(private decimalPipe: DecimalPipe) {}

  // 🔹 Lista de cuentas con sus respectivos ahorros
  savings = [
    { name: 'Efectivo', value: 250000 },
    { name: 'Bancolombia', value: 750000 },
    { name: 'Daviplata', value: 200000 },
    { name: 'Nequi', value: 300000 }
  ];

  // 🔹 Método para calcular el total ahorrado
  getTotalSavings(): number {
    return this.savings.reduce((sum, account) => sum + account.value, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
