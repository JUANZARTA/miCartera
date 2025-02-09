import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule], // ✅ Agregamos CommonModule para habilitar *ngFor y pipes
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'], // 🔹 Corregimos `styleUrl` -> `styleUrls`
  providers: [DecimalPipe]
})
export default class IncomeComponent {
  constructor(private decimalPipe: DecimalPipe) {}

  // 🔹 Lista de ingresos dinámica
  incomes = [
    { name: 'Siti World', category: 'Fijo', value: 1504000 },
    { name: 'Golden Panda', category: 'Variable', value: 350000 },
    { name: 'GPS', category: 'Variable', value: 70000 },
    { name: 'Otros ingresos', category: 'Variable', value: 232800 }
  ];

  // 🔹 Método para calcular el total de ingresos
  getTotalIncome(): number {
    return this.incomes.reduce((sum, income) => sum + income.value, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
