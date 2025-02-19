import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [DecimalPipe]
})
export default class ExpenseComponent implements OnInit {
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  expenses: any[] = [];

  ngOnInit() {
    this.loadExpenses();
  }

  // 🔹 Cargar los gastos desde el JSON
  loadExpenses() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        console.log('📌 JSON cargado correctamente:', data);
        this.expenses = data.gastos;
      },
      error: (err) => {
        console.error('❌ Error al cargar JSON:', err);
      }
    });
  }

  // 🔹 Método para calcular el total de gastos reales
  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.valor, 0);
  }

  // 🔹 Método para calcular el total estimado
  getTotalEstimated(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.estimacion, 0);
  }

  // 🔹 Método para formatear valores de moneda
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // 🔴 Método para detectar si el gasto real es mayor que la estimación
  isOverBudget(expense: { valor: number; estimacion: number }): boolean {
    return expense.valor > expense.estimacion;
  }
}
