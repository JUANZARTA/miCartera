import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebtService } from '../../services/debts.service';
import { Debt } from '../../models/debt.model';

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
export default class DebtsComponent implements OnInit {
  // Servicios
  private debtService = inject(DebtService);
  private decimalPipe = inject(DecimalPipe);

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

  readonly userId = 'UsorIijcpxfEymdA3uZrusvip0g2';
  readonly year = '2024';
  readonly month = '01';

  ngOnInit() {
    this.loadDebts();
  }

  // ======================
  // Obtener deudas
  // ======================
  loadDebts() {
    this.debtService.getDebts(this.userId, this.year, this.month).subscribe({
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

    this.debtService.addDebt(this.userId, this.year, this.month, { ...this.newDebt }).subscribe({
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

    this.debtService.updateDebt(this.userId, this.year, this.month, this.editedId, this.editedDebt).subscribe({
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

    this.debtService.deleteDebt(this.userId, this.year, this.month, id).subscribe({
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
