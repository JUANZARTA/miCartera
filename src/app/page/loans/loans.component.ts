import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';

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
  loans: Loan[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  // Edición
  editedLoan: Loan = new Loan('', '', '', 0, 'Pendiente');
  editedIndex: number | null = null;

  // Préstamo nuevo (modal)
  newLoan: Loan = new Loan('', '', '', 0, 'Pendiente');

  ngOnInit() {
    this.loadLoans();
  }

  // ======================
  // Obtener préstamos
  // ======================
  loadLoans() {
    this.loanService.getLoans().subscribe({
      next: (data) => {
        this.loans = data;
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

    this.loanService.addLoan({ ...this.newLoan }).subscribe({
      next: (updatedList) => {
        this.loans = updatedList;
        this.closeModal();
      },
    });
  }

  // ======================
  // Modal: Editar Préstamo
  // ======================
  openEditModal(index: number) {
    const original = this.loans[index];
    this.editedLoan = new Loan(
      original.deudor,
      original.fecha_prestamo,
      original.fecha_pago,
      original.valor,
      original.estado
    );
    this.editedIndex = index;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedLoan = new Loan('', '', '', 0, 'Pendiente');
    this.editedIndex = null;
  }

  saveEditedLoan() {
    if (this.editedIndex === null) return;

    this.loanService.updateLoan(this.editedIndex, { ...this.editedLoan }).subscribe({
      next: (updatedList) => {
        this.loans = updatedList;
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
  deleteLoan(index: number) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este préstamo?');
    if (!confirmDelete) return;

    this.loanService.deleteLoan(index).subscribe({
      next: (updatedList) => {
        this.loans = updatedList;
      },
      error: (err) => {
        console.error('Error al eliminar préstamo:', err);
      },
    });
  }

  togglePaymentStatus(loan: Loan) {
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
