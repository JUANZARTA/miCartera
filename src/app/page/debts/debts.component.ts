import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebtService } from '../../services/debts.service';
import { Debt } from '../../models/debt.model';
import { DateService } from '../../services/date.service'; // ✅ Nuevo
import { Subscription } from 'rxjs'; // ✅ Nuevo

export interface DebtWithId extends Debt {
  id: string;
}

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css'],
  providers: [DecimalPipe]
})
export default class DebtsComponent implements OnInit, OnDestroy {
  // Servicios
  private debtService = inject(DebtService);
  private decimalPipe = inject(DecimalPipe);
  private dateService = inject(DateService); // ✅ Nuevo

  // Datos
  debts: DebtWithId[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  // Edición
  editedDebt: Debt = new Debt('', '', '', 0, 'Pendiente');
  editedId: string | null = null;

  // Deuda nueva
  newDebt: Debt = new Debt('', '', '', 0, 'Pendiente');

  readonly userId = JSON.parse(localStorage.getItem('user') || '{}').localId;

  currentYear: string = '';
  currentMonth: string = '';
  private dateSubscription: Subscription | undefined; // ✅ Nuevo

  ngOnInit() {
    // ✅ Escuchar cambios en el año y mes seleccionados
    this.dateSubscription = this.dateService.selectedDate$.subscribe(date => {
      if (date.year && date.month) {
        this.currentYear = date.year;
        this.currentMonth = date.month;
        this.loadDebts();
      }
    });
  }

  ngOnDestroy(): void {
    this.dateSubscription?.unsubscribe();
  }

  // ======================
  // Obtener deudas
  // ======================
  loadDebts() {
    this.debtService.getDebts(this.userId, this.currentYear, this.currentMonth).subscribe({
      next: (data) => {
        this.debts = Object.entries(data).map(([id, d]) => ({ id, ...d }));
      },
      error: (err) => {
        console.error('Error al cargar deudas:', err);
      }
    });
  }

  // ======================
  // Modal: Agregar Deuda
  // ======================
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newDebt = new Debt('', '', '', 0, 'Pendiente');
  }

  addDebt() {
    if (!this.newDebt.acreedor || !this.newDebt.fecha_deuda || !this.newDebt.fecha_pago || this.newDebt.valor <= 0) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.debtService.addDebt(this.userId, this.currentYear, this.currentMonth, { ...this.newDebt }).subscribe({
      next: () => {
        this.loadDebts();
        this.closeModal();
      }
    });
  }

  // ======================
  // Modal: Editar Deuda
  // ======================
  openEditModal(id: string) {
    const original = this.debts.find(d => d.id === id);
    if (!original) return;

    this.editedDebt = new Debt(
      original.acreedor,
      original.fecha_deuda,
      original.fecha_pago,
      original.valor,
      original.estado
    );
    this.editedId = id;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedDebt = new Debt('', '', '', 0, 'Pendiente');
    this.editedId = null;
  }

  saveEditedDebt() {
    if (!this.editedId) return;

    this.debtService.updateDebt(this.userId, this.currentYear, this.currentMonth, this.editedId, this.editedDebt).subscribe({
      next: () => {
        this.loadDebts();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error al actualizar deuda:', err);
      }
    });
  }

  // ======================
  // Eliminar
  // ======================
  deleteDebt(id: string) {
    const confirmDelete = confirm('¿Estás seguro de eliminar esta deuda?');
    if (!confirmDelete) return;

    this.debtService.deleteDebt(this.userId, this.currentYear, this.currentMonth, id).subscribe({
      next: () => {
        this.loadDebts();
      },
      error: (err) => {
        console.error('Error al eliminar deuda:', err);
      }
    });
  }

  // ======================
  // Estado
  // ======================
  togglePaymentStatus(debt: DebtWithId) {
    debt.estado = debt.estado === 'Pendiente' ? 'Pagado' : 'Pendiente';
  }

  // ======================
  // Utilidades
  // ======================
  getTotalPendingDebts(): number {
    return this.debts
      .filter((debt) => debt.estado === 'Pendiente')
      .reduce((sum, debt) => sum + Number(debt.valor), 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
