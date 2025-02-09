import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule], // ✅ Importamos CommonModule para habilitar *ngFor y pipes
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [DecimalPipe] // ✅ Agregamos DecimalPipe para formatear valores
})
export default class ExpenseComponent {
  constructor(private decimalPipe: DecimalPipe) {}

  // 🔹 Lista de gastos con descripción, categoría, valor real y estimación
  expenses = [
    { description: 'Renta', category: 'Servicios', value: 1200000, estimated: 1250000 },
    { description: 'Comida', category: 'Comida', value: 400000, estimated: 350000 }, // 🔴 Exceso de gasto
    { description: 'Gasolina ', category: 'Transoporte', value: 152000, estimated: 150000 },// 🔴 Exceso de gasto
    { description: 'Salidas', category: 'Osio', value: 200000, estimated: 200000 },
    { description: 'Otros gastos', category: 'Otro Tipo', value: 300000, estimated: 350000 }
  ];

  // 🔹 Método para calcular el total de gastos reales
  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.value, 0);
  }

  // 🔹 Método para calcular el total estimado
  getTotalEstimated(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.estimated, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // 🔴 Método para detectar si el gasto real es mayor que la estimación
  isOverBudget(expense: { value: number; estimated: number }): boolean {
    return expense.value > expense.estimated;
  }
}
