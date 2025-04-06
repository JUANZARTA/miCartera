import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { CategoriaGasto, Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [DecimalPipe],
})
export default class ExpenseComponent implements OnInit {
  // Servicios
  private expenseService = inject(ExpenseService);
  private decimalPipe = inject(DecimalPipe);

  // Datos
  expenses: Expense[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  // Edición inline (opcional)
  editingIndex: number | null = null;
  editingField = '';

  // Categorías disponibles
  categorias: string[] = Object.values(CategoriaGasto);

  // Gasto nuevo (modal)
  newExpense: Expense = new Expense('', CategoriaGasto.Variable, 0, 0);

  // Gasto en edición (modal)
  editedExpense: Expense = new Expense('', CategoriaGasto.Variable, 0, 0);
  editedIndex: number | null = null;

  ngOnInit() {
    this.loadExpenses();
  }

  // Obtener gastos desde el servicio
  loadExpenses() {
    this.expenseService.getExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar gastos:', err);
      },
    });
  }

  // ======================
  // Modal: Agregar Gasto
  // ======================
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newExpense = new Expense('', CategoriaGasto.Variable, 0, 0);
  }

  addExpense() {
    if (!this.newExpense.descripcion || !this.newExpense.categoria) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.expenseService.addExpense({ ...this.newExpense }).subscribe({
      next: (updatedExpenses) => {
        this.expenses = updatedExpenses;
        this.closeModal();
      },
    });
  }

  // ======================
  // Modal: Editar Gasto
  // ======================
  openEditModal(index: number) {
    const original = this.expenses[index];
    this.editedExpense = new Expense(
      original.descripcion,
      original.categoria,
      original.valor,
      original.estimacion
    );
    this.editedIndex = index;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedExpense = new Expense('', CategoriaGasto.Variable, 0, 0);
    this.editedIndex = null;
  }

  saveEditedExpense() {
    if (this.editedIndex === null) return;

    this.expenseService
      .updateExpense(this.editedIndex, { ...this.editedExpense })
      .subscribe({
        next: (updatedExpenses) => {
          this.expenses = updatedExpenses;
          this.closeEditModal();
        },
        error: (err) => {
          console.error('❌ Error al guardar edición:', err);
        },
      });
  }

  // ======================
  // Eliminar
  // ======================
  deleteExpense(index: number) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este gasto?');
    if (!confirmDelete) return;

    this.expenseService.deleteExpense(index).subscribe({
      next: (updatedExpenses) => {
        this.expenses = updatedExpenses;
      },
      error: (err) => {
        console.error('❌ Error al eliminar el gasto:', err);
      },
    });
  }

  // ======================
  // Utilidades
  // ======================
  getTotalExpenses(): number {
    return this.expenses.reduce((sum, e) => sum + Number(e.valor), 0);
  }

  getTotalEstimated(): number {
    return this.expenses.reduce((sum, e) => sum + Number(e.estimacion), 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  isOverBudget(expense: Expense): boolean {
    return Number(expense.valor) > Number(expense.estimacion);
  }

  getGroupedExpenses(): { categoria: string; items: Expense[] }[] {
    const map = new Map<string, Expense[]>();

    for (const exp of this.expenses) {
      const cat = exp.categoria;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(exp);
    }

    return Array.from(map.entries()).map(([categoria, items]) => ({ categoria, items }));
  }

  getGroupTotal(items: any[]) {
    return items.reduce((acc, item) => acc + (Number(item.valor) || 0), 0);
  }

  getGroupEstimatedTotal(items: any[]) {
    return items.reduce((acc, item) => acc + (Number(item.estimacion) || 0), 0);
  }

  getTotalEstimations() {
    return this.expenses.reduce((acc, item) => acc + (Number(item.estimacion) || 0), 0);
  }

  // (Opcional) Edición inline
  editField(index: number, field: string) {
    this.editingIndex = index;
    this.editingField = field;
  }

  saveEdit() {
    if (this.editingIndex !== null && this.editingField) {
      const updatedExpense = this.expenses[this.editingIndex];
      this.expenseService
        .updateExpense(this.editingIndex, updatedExpense)
        .subscribe({
          next: (updatedList) => {
            this.expenses = updatedList;
          },
          error: (err) => {
            console.error('❌ Error al actualizar gasto:', err);
          },
        });
    }

    this.editingIndex = null;
    this.editingField = '';
  }
}
