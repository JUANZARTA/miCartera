import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.css'],
  providers: [DecimalPipe]
})
export default class DebtsComponent implements OnInit {
  // Inyección de dependencias
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);
  // Variables
  editingIndex: number | null = null;
  editingField: string = '';

  debts: any[] = [];
  isModalOpen: boolean = false;

  newDebt = {
    acreedor: '',
    fecha_deuda: '',
    fecha_pago: '',
    valor: 0,
    estado: 'Pendiente'
  };

  // Método para inicializar el componente
  ngOnInit() {
    this.loadDebts();
  }

  // Método para cargar las deudas
  loadDebts() {
    this.http.get<any>('/assets/json/debts.json').subscribe({
      next: (data) => {
        this.debts = data.deudas;
      }
    });
  }

  // Método para obtener el total de deudas pendientes
  getTotalPendingDebts(): number {
    return this.debts.filter(debt => debt.estado === 'Pendiente').reduce((sum, debt) => sum + Number(debt.valor), 0);
  }

  // Método para obtener el total de deudas pagadas
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // Método para cambiar el estado de la deuda
  togglePaymentStatus(debt: any) {
    debt.estado = debt.estado === 'Pendiente' ? 'Pagado' : 'Pendiente';
  }

  // Método para abrir el modal
  openModal() { this.isModalOpen = true; }
  // Método para cerrar el modal
  closeModal() { this.isModalOpen = false; }
  // Método para agregar una deuda
  addDebt() { this.debts.push({ ...this.newDebt }); this.closeModal(); }
  // Método para eliminar una deuda
  editField(index: number, field: string) { this.editingIndex = index; this.editingField = field; }
  // Método para guardar la edición
  saveEdit() { this.editingIndex = null; this.editingField = ''; }
}
