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
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  debts: any[] = [];
  isModalOpen: boolean = false;

  newDebt = {
    acreedor: '',
    fecha_deuda: '',
    fecha_pago: '',
    valor: 0,
    estado: 'Pendiente'
  };

  editingIndex: number | null = null;
  editingField: string = '';

  ngOnInit() {
    this.loadDebts();
  }

  loadDebts() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        this.debts = data.deudas;
      }
    });
  }

  getTotalPendingDebts(): number {
    return this.debts.filter(debt => debt.estado === 'Pendiente').reduce((sum, debt) => sum + Number(debt.valor), 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  openModal() { this.isModalOpen = true; }

  closeModal() { this.isModalOpen = false; }

  addDebt() { this.debts.push({ ...this.newDebt }); this.closeModal(); }

  editField(index: number, field: string) { this.editingIndex = index; this.editingField = field; }

  saveEdit() { this.editingIndex = null; this.editingField = ''; }
  
  togglePaymentStatus(debt: any) {
    debt.estado = debt.estado === 'Pendiente' ? 'Pagado' : 'Pendiente';
  }
}
