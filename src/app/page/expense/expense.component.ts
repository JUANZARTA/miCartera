import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { CategoriaGasto, Expense } from '../../models/expense.model';

export interface ExpenseWithId extends Expense {
  id: string;
}

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [DecimalPipe],
})
export default class ExpenseComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private decimalPipe = inject(DecimalPipe);

  expenses: ExpenseWithId[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  categorias: string[] = Object.values(CategoriaGasto);

  newExpense: Expense = new Expense('', CategoriaGasto.Variable, null as any, null as any);
  editedExpense: Expense = new Expense('', CategoriaGasto.Variable, null as any, null as any);
  editedId: string | null = null;

  readonly userId = JSON.parse(localStorage.getItem('user') || '{}').localId;
  readonly year = '2024';
  readonly month = '01';

  // Variables para el gráfico
  ngOnInit() {
    this.loadExpenses();
  }

  // Método para cargar los gastos
  loadExpenses() {
    this.expenseService.getExpenses(this.userId, this.year, this.month).subscribe({
      next: (data) => {
        this.expenses = Object.entries(data).map(([id, exp]) => ({ id, ...exp }));
      },
      error: (err) => {
        console.error('❌ Error al cargar gastos:', err);
      },
    });
  }

  // Métodos para abrir y cerrar modales
  openModal() {
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.newExpense = new Expense('', CategoriaGasto.Variable, 0, 0);
  }

  // Método para agregar un nuevo gasto
  addExpense() {
    if (!this.newExpense.descripcion || !this.newExpense.categoria) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.expenseService.addExpense(this.userId, this.year, this.month, this.newExpense).subscribe({
      next: () => {
        this.loadExpenses(); // Recargar
        this.closeModal();
      },
    });
  }

  // Métodos para editar y eliminar gastos
  openEditModal(id: string) {
    const original = this.expenses.find(e => e.id === id);
    if (!original) return;

    this.editedExpense = new Expense(
      original.descripcion,
      original.categoria,
      original.valor,
      original.estimacion
    );
    this.editedId = id;
    this.isEditModalOpen = true;
  }

  // Método para cerrar el modal de edición
  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedExpense = new Expense('', CategoriaGasto.Variable, 0, 0);
    this.editedId = null;
  }

  // Método para guardar los cambios de edición
  saveEditedExpense() {
    if (!this.editedId) return;

    this.expenseService
      .updateExpense(this.userId, this.year, this.month, this.editedId, this.editedExpense)
      .subscribe({
        next: () => {
          this.loadExpenses();
          this.closeEditModal();
        },
      });
  }

  // Método para eliminar un gasto
  deleteExpense(id: string) {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return;

    this.expenseService.deleteExpense(this.userId, this.year, this.month, id).subscribe({
      next: () => {
        this.loadExpenses();
      },
    });
  }

  // Método para eliminar todos los gastos
  getTotalExpenses(): number {
    return this.expenses.reduce((sum, e) => sum + Number(e.valor), 0);
  }

  // Método para obtener el total estimado de gastos
  getTotalEstimated(): number {
    return this.expenses.reduce((sum, e) => sum + Number(e.estimacion), 0);
  }

  // Método para formatear el valor a moneda
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // Método para formatear el valor a porcentaje
  isOverBudget(expense: Expense): boolean {
    return Number(expense.valor) > Number(expense.estimacion);
  }

  // Método para formatear el valor a porcentaje
  getGroupedExpenses(): { categoria: string; items: ExpenseWithId[] }[] {
    const map = new Map<string, ExpenseWithId[]>();

    for (const exp of this.expenses) {
      const cat = exp.categoria;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(exp);
    }

    return Array.from(map.entries()).map(([categoria, items]) => ({ categoria, items }));
  }

  // Método para calcular el total por categoría
  getGroupTotal(items: any[]) {
    return items.reduce((acc, item) => acc + (Number(item.valor) || 0), 0);
  }

  // Método para calcular el total estimado por categoría
  getGroupEstimatedTotal(items: any[]) {
    return items.reduce((acc, item) => acc + (Number(item.estimacion) || 0), 0);
  }

  // Método para calcular el total de estimaciones
  getTotalEstimations() {
    return this.expenses.reduce((acc, item) => acc + (Number(item.estimacion) || 0), 0);
  }

  // Procesar entrada y convertir a número limpio
onValueInput(event: Event, field: 'valor' | 'estimacion') {
  const input = (event.target as HTMLInputElement);
  const rawValue = input.value.replace(/[.,]/g, '');
  const numericValue = Number(rawValue) || 0;
  this.newExpense[field] = numericValue;
  input.value = this.formatCurrency(numericValue);
}

onEditValueInput(event: Event, field: 'valor' | 'estimacion') {
  const input = (event.target as HTMLInputElement);
  const rawValue = input.value.replace(/[.,]/g, '');
  const numericValue = Number(rawValue) || 0;
  this.editedExpense[field] = numericValue;
  input.value = this.formatCurrency(numericValue);
}

}
