import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loans.service';
import { Loan } from '../../models/loans.model';

export interface LoanWithId extends Loan {
  id: string;
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
  providers: [DecimalPipe],
})
export default class LoansComponent implements OnInit {
  // Servicios
  private loanService = inject(LoanService);
  private decimalPipe = inject(DecimalPipe);

  // Datos
  loans: LoanWithId[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  // Edición
  editedLoan: Loan = new Loan('', '', '', 0, 'Pendiente');
  editedId: string | null = null;

  // Préstamo nuevo (modal)
  newLoan: Loan = new Loan('', '', '', 0, 'Pendiente');

  readonly userId = 'UsorIijcpxfEymdA3uZrusvip0g2';
  readonly year = '2024';
  readonly month = '01';

  ngOnInit() {
    this.loadLoans();
  }

  // ======================
  // Obtener préstamos
  // ======================
  loadLoans() {
    this.loanService.getLoans(this.userId, this.year, this.month).subscribe({
      next: (data) => {
        this.loans = Object.entries(data).map(([id, loan]) => ({ id, ...loan }));
      },
      error: (err) => {
        console.error('Error al cargar préstamos:', err);
      },
    });
  }

  // ======================
  // Modal: Agregar Préstamo
  // ======================
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newLoan = new Loan('', '', '', 0, 'Pendiente');
  }

  addLoan() {
    if (!this.newLoan.deudor || !this.newLoan.fecha_prestamo || !this.newLoan.fecha_pago || this.newLoan.valor <= 0) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.loanService.addLoan(this.userId, this.year, this.month, this.newLoan).subscribe({
      next: () => {
        this.loadLoans();
        this.closeModal();
      },
    });
  }

  // ======================
  // Modal: Editar Préstamo
  // ======================
  openEditModal(id: string) {
    const original = this.loans.find(l => l.id === id);
    if (!original) return;

    this.editedLoan = new Loan(
      original.deudor,
      original.fecha_prestamo,
      original.fecha_pago,
      original.valor,
      original.estado
    );
    this.editedId = id;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedLoan = new Loan('', '', '', 0, 'Pendiente');
    this.editedId = null;
  }

  saveEditedLoan() {
    if (!this.editedId) return;

    this.loanService.updateLoan(this.userId, this.year, this.month, this.editedId, this.editedLoan).subscribe({
      next: () => {
        this.loadLoans();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error al actualizar préstamo:', err);
      },
    });
  }

  // ======================
  // Eliminar
  // ======================
  deleteLoan(id: string) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este préstamo?');
    if (!confirmDelete) return;

    this.loanService.deleteLoan(this.userId, this.year, this.month, id).subscribe({
      next: () => {
        this.loadLoans();
      },
      error: (err) => {
        console.error('Error al eliminar préstamo:', err);
      },
    });
  }

  togglePaymentStatus(loan: LoanWithId) {
    loan.estado = loan.estado === 'Pendiente' ? 'Pagado' : 'Pendiente';
  }

  // ======================
  // Utilidades
  // ======================
  getTotalPendingLoans(): number {
    return this.loans
      .filter((loan) => loan.estado === 'Pendiente')
      .reduce((sum, loan) => sum + Number(loan.valor), 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
