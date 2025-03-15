import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
  providers: [DecimalPipe],
})
export default class LoansComponent implements OnInit {
  // Inyección de dependencias
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  // Variables
  loans: any[] = [];
  isModalOpen: boolean = false;  

  // Control de edición en la tabla
  editingIndex: number | null = null;
  editingField: string = '';

  // Objeto temporal para nuevos pré
  newLoan = {
    deudor: '',
    fecha_prestamo: '',
    fecha_pago: '',
    valor: 0,
    estado: 'Pendiente',
  };

  // Método para inicializar el componente
  ngOnInit() {
    this.loadLoans();
  }

  // Cargar los préstamos desde el JSON
  loadLoans() {
    this.http.get<any>('/assets/json/loans.json').subscribe({
      next: (data) => {
        this.loans = data.prestamos;
      },
      error: (err) => {
        //console.error('Error al cargar los préstamos:', err);
      },
    });
  }

  // Abrir modal
  openModal() {
    this.isModalOpen = true;
  }

  // Cerrar modal y resetear formulario
  closeModal() {
    this.isModalOpen = false;
    this.newLoan = {
      deudor: '',
      fecha_prestamo: '',
      fecha_pago: '',
      valor: 0,
      estado: 'Pendiente',
    };
  }

  // Agregar nuevo préstamo
  addLoan() {
    if (
      !this.newLoan.deudor ||
      !this.newLoan.fecha_prestamo ||
      !this.newLoan.fecha_pago ||
      this.newLoan.valor <= 0
    ) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.loans.push({ ...this.newLoan });
    this.closeModal();
  }

  // Calcular total de préstamos pendientes
  getTotalPendingLoans(): number {
    return this.loans
      .filter((loan) => loan.estado === 'Pendiente')
      .reduce((sum, loan) => sum + Number(loan.valor), 0);
  }

  // Formateo de moneda
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // Activar edición en la tabla
  editField(index: number, field: string) {
    this.editingIndex = index;
    this.editingField = field;
  }

  // Guardar cambios en la celda editada
  saveEdit() {
    this.editingIndex = null;
    this.editingField = '';
  }

  // Método para cambiar el estado del préstamo
  togglePaymentStatus(loan: any) {
    loan.estado = loan.estado === 'Pendiente' ? 'Pagado' : 'Pendiente';
  }
}
