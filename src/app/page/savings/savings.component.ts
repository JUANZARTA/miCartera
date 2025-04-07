import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SavingsService } from '../../services/savings.service';
import { Saving } from '../../models/savings.model';

export interface SavingWithId extends Saving {
  id: string;
}

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
  savings: SavingWithId[] = [];

  // Modales
  isModalOpen = false;
  isEditModalOpen = false;

  // Ahorro nuevo
  newSaving: Saving = new Saving('', 0);

  // Ahorro en edición
  editedSaving: Saving = new Saving('', 0);
  editedId: string | null = null;

  readonly userId = 'UsorIijcpxfEymdA3uZrusvip0g2';
  readonly year = '2024';
  readonly month = '01';

  ngOnInit() {
    this.loadSavings();
  }

  // Obtener ahorros
  loadSavings() {
    this.savingsService.getSavings(this.userId, this.year, this.month).subscribe({
      next: (data) => {
        this.savings = Object.entries(data).map(([id, s]) => ({ id, ...s }));
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

    this.savingsService.addSaving(this.userId, this.year, this.month, this.newSaving).subscribe({
      next: () => {
        this.loadSavings();
        this.closeModal();
      },
    });
  }

  // ======================
  // Modal: Editar Ahorro
  // ======================
  openEditModal(id: string) {
    const original = this.savings.find(s => s.id === id);
    if (!original) return;

    this.editedSaving = new Saving(original.tipo, original.valor);
    this.editedId = id;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editedSaving = new Saving('', 0);
    this.editedId = null;
  }

  saveEditedSaving() {
    if (!this.editedId) return;

    this.savingsService.updateSaving(this.userId, this.year, this.month, this.editedId, this.editedSaving).subscribe({
      next: () => {
        this.loadSavings();
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
  deleteSaving(id: string) {
    const confirmDelete = confirm('¿Estás seguro de eliminar este ahorro?');
    if (!confirmDelete) return;

    this.savingsService.deleteSaving(this.userId, this.year, this.month, id).subscribe({
      next: () => {
        this.loadSavings();
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
