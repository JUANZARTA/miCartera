import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../services/income.service';
import { CategoriaIngreso, Income } from '../../models/income.model';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
  providers: [DecimalPipe]
})
export default class IncomeComponent implements OnInit {
  // Servicios
  private incomeService = inject(IncomeService);
  private decimalPipe = inject(DecimalPipe);

  // Datos
  incomes: Income[] = [];

  // Modales
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;

  // Categorías disponibles
  categorias: string[] = Object.values(CategoriaIngreso);

  // Ingreso nuevo (modal)
  newIncome: Income = new Income('', CategoriaIngreso.Fijo, 0);

  // Ingreso en edición (modal)
  editedIncome: Income = new Income('', CategoriaIngreso.Fijo, 0);
  editedIndex: number | null = null;

  ngOnInit() {
    this.loadIncomes();
  }

  // Obtener ingresos desde el servicio
  loadIncomes() {
    this.incomeService.getIncomes().subscribe({
      next: (data) => {
        this.incomes = data;
      },
      error: (err) => {
        console.error('Error al cargar ingresos:', err);
      },
    });
  }

  // ======================
  // Modal: Agregar Ingreso
  // ======================
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newIncome = new Income('', CategoriaIngreso.Fijo, 0);
  }

  addIncome() {
    if (!this.newIncome.nombre || !this.newIncome.categoria) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.incomeService.addIncome({ ...this.newIncome }).subscribe({
      next: (updatedList) => {
        this.incomes = updatedList;
        this.closeModal();
      },
    });
  }

  // ======================
  // Modal: Editar Ingreso
  // ======================
  openEditModal(index: number) {
    const original = this.incomes[index];
    this.editedIncome = new Income(
      original.nombre,
      original.categoria,
      original.valor
    );
    this.editedIndex = index;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedIncome = new Income('', CategoriaIngreso.Fijo, 0);
    this.editedIndex = null;
  }

  saveEditedIncome() {
    if (this.editedIndex === null) return;

    this.incomeService.updateIncome(this.editedIndex, { ...this.editedIncome }).subscribe({
      next: (updatedList) => {
        this.incomes = updatedList;
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error al actualizar ingreso:', err);
      },
    });
  }

  // ======================
  // Eliminar
  // ======================
  deleteIncome(index: number) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este ingreso?');
    if (!confirmDelete) return;

    this.incomeService.deleteIncome(index).subscribe({
      next: (updatedList) => {
        this.incomes = updatedList;
      },
      error: (err) => {
        console.error('Error al eliminar ingreso:', err);
      },
    });
  }

  // ======================
  // Utilidades
  // ======================
  getTotalIncome(): number {
    return this.incomes.reduce((sum, e) => sum + Number(e.valor), 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  getGroupedIncomes(): { categoria: string; items: Income[] }[] {
    const map = new Map<string, Income[]>();

    for (const income of this.incomes) {
      const cat = income.categoria;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(income);
    }

    return Array.from(map.entries()).map(([categoria, items]) => ({ categoria, items }));
  }

  getGroupTotal(items: Income[]) {
    return items.reduce((acc, item) => acc + (Number(item.valor) || 0), 0);
  }
}
