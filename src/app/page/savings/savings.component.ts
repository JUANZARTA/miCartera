import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SavingsService } from '../../services/savings.service';
import { Saving } from '../../models/savings.model';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css'],
  providers: [DecimalPipe]
})
export default class SavingsComponent implements OnInit {
  // Servicios
  private savingsService = inject(SavingsService);
  private decimalPipe = inject(DecimalPipe);

  // Datos
  savings: Saving[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  // Ahorro nuevo
  newSaving: Saving = new Saving('', 0);

  // Ahorro en edición
  editedSaving: Saving = new Saving('', 0);
  editedIndex: number | null = null;

  ngOnInit() {
    this.loadSavings();
  }

  // Obtener ahorros
  loadSavings() {
    this.savingsService.getSavings().subscribe({
      next: (data) => {
        this.savings = data;
      },
      error: (err) => {
        console.error('Error al cargar ahorros:', err);
      },
    });
  }

  // ======================
  // Modal: Agregar Ahorro
  // ======================
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newSaving = new Saving('', 0);
  }

  addSaving() {
    if (!this.newSaving.tipo) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.savingsService.addSaving({ ...this.newSaving }).subscribe({
      next: (updatedList) => {
        this.savings = updatedList;
        this.closeModal();
      },
    });
  }

  // ======================
  // Modal: Editar Ahorro
  // ======================
  openEditModal(index: number) {
    const original = this.savings[index];
    this.editedSaving = new Saving(original.tipo, original.valor);
    this.editedIndex = index;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedSaving = new Saving('', 0);
    this.editedIndex = null;
  }

  saveEditedSaving() {
    if (this.editedIndex === null) return;

    this.savingsService.updateSaving(this.editedIndex, { ...this.editedSaving }).subscribe({
      next: (updatedList) => {
        this.savings = updatedList;
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error al actualizar ahorro:', err);
      },
    });
  }

  // ======================
  // Eliminar
  // ======================
  deleteSaving(index: number) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este ahorro?');
    if (!confirmDelete) return;

    this.savingsService.deleteSaving(index).subscribe({
      next: (updatedList) => {
        this.savings = updatedList;
      },
      error: (err) => {
        console.error('Error al eliminar ahorro:', err);
      },
    });
  }

  // ======================
  // Utilidades
  // ======================
  getTotalSavings(): number {
    return this.savings.reduce((sum, e) => sum + Number(e.valor), 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
