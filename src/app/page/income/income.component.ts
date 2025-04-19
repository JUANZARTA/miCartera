import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomeService } from '../../services/income.service';
import { CategoriaIngreso, Income } from '../../models/income.model';
import { DateService } from '../../services/date.service'; // ✅ Nuevo
import { Subscription } from 'rxjs'; // ✅ Nuevo
import { AuthService } from '../../services/auth.service'; // ✅ Nuevo


export interface IncomeWithId extends Income {
  id: string;
}

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
  providers: [DecimalPipe]
})
export default class IncomeComponent implements OnInit, OnDestroy {
  // Servicios
  private incomeService = inject(IncomeService);
  private decimalPipe = inject(DecimalPipe);
  private dateService = inject(DateService); // ✅ Nuevo
  private authService = inject(AuthService); // ✅ Nuevo

  // Datos
  incomes: IncomeWithId[] = [];

  // Modales
  isModalOpen: boolean = false;
  isEditModalOpen: boolean = false;

  // Categorías disponibles
  categorias: string[] = Object.values(CategoriaIngreso);

  // Ingreso nuevo (modal)
  newIncome: Income = new Income('', CategoriaIngreso.Fijo, null as any);

  // Ingreso en edición (modal)
  editedIncome: Income = new Income('', CategoriaIngreso.Fijo, null as any);
  editedId: string | null = null;

  readonly userId = JSON.parse(localStorage.getItem('user') || '{}').localId;

  currentYear: string = '';
  currentMonth: string = '';
  private dateSubscription: Subscription | undefined; // ✅ Nuevo

  ngOnInit() {
    // ✅ Suscripción reactiva a cambios de año/mes
    this.dateSubscription = this.dateService.selectedDate$.subscribe(date => {
      if (date.year && date.month) {
        this.currentYear = date.year;
        this.currentMonth = date.month;
        this.loadIncomes();
      }
    });
  }

  ngOnDestroy(): void {
    this.dateSubscription?.unsubscribe();
  }

  // Obtener ingresos desde Firebase
  loadIncomes() {
    this.incomeService.getIncomes(this.userId, this.currentYear, this.currentMonth).subscribe({
      next: (data) => {
        this.incomes = Object.entries(data).map(([id, income]) => ({ id, ...income }));
      },
      error: (err) => {
        console.error('❌ Error al cargar ingresos:', err);
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
    this.newIncome = new Income('', CategoriaIngreso.Fijo, null as any);
  }

  addIncome() {
    if (!this.newIncome.nombre || !this.newIncome.categoria) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.incomeService.addIncome(this.userId, this.currentYear, this.currentMonth, this.newIncome).subscribe({
      next: () => {
        this.loadIncomes();
        this.closeModal();

        // ✅ Notificación de ingreso registrado
        this.authService.addNotification(this.userId, 'Nuevo ingreso registrado').subscribe();
      },
    });
  }


  // ======================
  // Modal: Editar Ingreso
  // ======================
  openEditModal(id: string) {
    const original = this.incomes.find(i => i.id === id);
    if (!original) return;

    this.editedIncome = new Income(
      original.nombre,
      original.categoria,
      original.valor
    );
    this.editedId = id;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedIncome = new Income('', CategoriaIngreso.Fijo, null as any);
    this.editedId = null;
  }

  saveEditedIncome() {
    if (!this.editedId) return;

    this.incomeService.updateIncome(this.userId, this.currentYear, this.currentMonth, this.editedId, this.editedIncome).subscribe({
      next: () => {
        this.loadIncomes();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('❌ Error al actualizar ingreso:', err);
      },
    });
  }

  // ======================
  // Eliminar
  // ======================
  deleteIncome(id: string) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este ingreso?');
    if (!confirmDelete) return;

    this.incomeService.deleteIncome(this.userId, this.currentYear, this.currentMonth, id).subscribe({
      next: () => {
        this.loadIncomes();
      },
      error: (err) => {
        console.error('❌ Error al eliminar ingreso:', err);
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

  getGroupedIncomes(): { categoria: string; items: IncomeWithId[] }[] {
    const map = new Map<string, IncomeWithId[]>();

    for (const income of this.incomes) {
      const cat = income.categoria;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(income);
    }

    return Array.from(map.entries()).map(([categoria, items]) => ({ categoria, items }));
  }

  getGroupTotal(items: IncomeWithId[]) {
    return items.reduce((acc, item) => acc + (Number(item.valor) || 0), 0);
  }

  // ======================
  // Formateo visual inputs
  // ======================
  onValueInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/[.,]/g, '');
    const value = Number(raw) || 0;
    this.newIncome.valor = value;
    input.value = this.formatCurrency(value);
  }

  onEditValueInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/[.,]/g, '');
    const value = Number(raw) || 0;
    this.editedIncome.valor = value;
    input.value = this.formatCurrency(value);
  }
}
