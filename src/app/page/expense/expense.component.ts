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

  newExpense: Expense = new Expense('', CategoriaGasto.Variable, 0, 0);
  editedExpense: Expense = new Expense('', CategoriaGasto.Variable, 0, 0);
  editedId: string | null = null;

  readonly userId = 'UsorIijcpxfEymdA3uZrusvip0g2';
  readonly year = '2024';
  readonly month = '01';

  ngOnInit() {
    this.loadExpenses();
  }

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

    this.expenseService.addExpense(this.userId, this.year, this.month, this.newExpense).subscribe({
      next: () => {
        this.loadExpenses(); // Recargar
        this.closeModal();
      },
    });
  }

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

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedExpense = new Expense('', CategoriaGasto.Variable, 0, 0);
    this.editedId = null;
  }

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

  deleteExpense(id: string) {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return;

    this.expenseService.deleteExpense(this.userId, this.year, this.month, id).subscribe({
      next: () => {
        this.loadExpenses();
      },
    });
  }

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

  getGroupTotal(items: any[]) {
    return items.reduce((acc, item) => acc + (Number(item.valor) || 0), 0);
  }

  getGroupEstimatedTotal(items: any[]) {
    return items.reduce((acc, item) => acc + (Number(item.estimacion) || 0), 0);
  }

  getTotalEstimations() {
    return this.expenses.reduce((acc, item) => acc + (Number(item.estimacion) || 0), 0);
  }
}
