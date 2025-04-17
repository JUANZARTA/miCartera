import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SavingsService } from '../../services/savings.service';
import { Saving } from '../../models/savings.model';
import { DateService } from '../../services/date.service'; // ✅ Nuevo
import { Subscription } from 'rxjs'; // ✅ Nuevo

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
export default class SavingsComponent implements OnInit, OnDestroy {
  // Servicios
  private savingsService = inject(SavingsService);
  private decimalPipe = inject(DecimalPipe);
  private dateService = inject(DateService); // ✅ Nuevo

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

  readonly userId = JSON.parse(localStorage.getItem('user') || '{}').localId;

  currentYear: string = '';
  currentMonth: string = '';
  private dateSubscription: Subscription | undefined; // ✅ Nuevo

  ngOnInit() {
    // ✅ Escuchar cambios en la fecha
    this.dateSubscription = this.dateService.selectedDate$.subscribe(date => {
      if (date.year && date.month) {
        this.currentYear = date.year;
        this.currentMonth = date.month;
        this.loadSavings();
      }
    });
  }

  ngOnDestroy(): void {
    this.dateSubscription?.unsubscribe();
  }

  // Obtener ahorros
  loadSavings() {
    this.savingsService.getSavings(this.userId, this.currentYear, this.currentMonth).subscribe({
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

    this.savingsService.addSaving(this.userId, this.currentYear, this.currentMonth, this.newSaving).subscribe({
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

    this.savingsService.updateSaving(this.userId, this.currentYear, this.currentMonth, this.editedId, this.editedSaving).subscribe({
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

    this.savingsService.deleteSaving(this.userId, this.currentYear, this.currentMonth, id).subscribe({
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

  onValueInput(event: Event, type: 'new' | 'edit') {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/[.,]/g, '');
    const value = Number(raw) || null;

    if (type === 'new') {
      this.newSaving.valor = value ?? 0;
    } else {
      this.editedSaving.valor = value ?? 0;
    }

    input.value = this.formatCurrency(value ?? 0);
  }

}
