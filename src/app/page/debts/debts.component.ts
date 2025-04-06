import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebtService } from '../../services/debts.service';
import { Debt } from '../../models/debt.model';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css'],
  providers: [DecimalPipe]
})
export default class DebtsComponent implements OnInit {
  // Servicios
  private debtService = inject(DebtService);
  private decimalPipe = inject(DecimalPipe);

  // Datos
  debts: Debt[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  // Edición
  editedDebt: Debt = new Debt('', '', '', 0, 'Pendiente');
  editedIndex: number | null = null;

  // Deuda nueva
  newDebt: Debt = new Debt('', '', '', 0, 'Pendiente');

  ngOnInit() {
    this.loadDebts();
  }

  // ======================
  // Obtener deudas
  // ======================
  loadDebts() {
    this.debtService.getDebts().subscribe({
      next: (data) => {
        this.debts = data;
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

    this.debtService.addDebt({ ...this.newDebt }).subscribe({
      next: (updatedList) => {
        this.debts = updatedList;
        this.closeModal();
      }
    });
  }

  // ======================
  // Modal: Editar Deuda
  // ======================
  openEditModal(index: number) {
    const original = this.debts[index];
    this.editedDebt = new Debt(
      original.acreedor,
      original.fecha_deuda,
      original.fecha_pago,
      original.valor,
      original.estado
    );
    this.editedIndex = index;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedDebt = new Debt('', '', '', 0, 'Pendiente');
    this.editedIndex = null;
  }

  saveEditedDebt() {
    if (this.editedIndex === null) return;

    this.debtService.updateDebt(this.editedIndex, { ...this.editedDebt }).subscribe({
      next: (updatedList) => {
        this.debts = updatedList;
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
  deleteDebt(index: number) {
    const confirmDelete = confirm('¿Estás seguro de eliminar esta deuda?');
    if (!confirmDelete) return;

    this.debtService.deleteDebt(index).subscribe({
      next: (updatedList) => {
        this.debts = updatedList;
      },
      error: (err) => {
        console.error('Error al eliminar deuda:', err);
      }
    });
  }

  // ======================
  // Estado
  // ======================
  togglePaymentStatus(debt: Debt) {
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
