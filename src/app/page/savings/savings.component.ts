import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css'],
  providers: [DecimalPipe]
})
export default class SavingsComponent implements OnInit {
  // Inyección de dependencias
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  // Variables
  savings: any[] = [];
  isModalOpen: boolean = false;

  // Variables para edición
  editingIndex: number | null = null;
  editingField: string = '';

  // Nuevo ahorro
  newSaving = {
    tipo: '',
    valor: 0
  };

  // Método para inicializar el componente
  ngOnInit() {
    this.loadSavings();
  }

  // Método para cargar los ahorros
  loadSavings() {
    this.http.get<any>('/assets/json/savings.json').subscribe({
      next: (data) => {
        this.savings = data.ahorros;
      }
    });
  }

  // Método para abrir el modal
  openModal() {
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para agregar un ahorro
  addSaving() {
    this.savings.push({ ...this.newSaving });
    this.closeModal();
  }

  // Método para obtener el total de ahorros
  getTotalSavings(): number {
    return this.savings.reduce((sum, account) => sum + account.valor, 0);
  }

  // Método para dar formato a un número como moneda
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // Método para editar un campo
  editField(index: number, field: string) {
    this.editingIndex = index;
    this.editingField = field;
  }

  // Método para guardar la edición
  saveEdit() {
    this.editingIndex = null;
    this.editingField = '';
  }
}
