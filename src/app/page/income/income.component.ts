import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
  providers: [DecimalPipe]
})
export default class IncomeComponent implements OnInit {
  // Inyección de dependencias
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  // Variables
  incomes: any[] = [];
  isModalOpen: boolean = false;
  categorias: string[] = ['Fijo', 'Variable', 'Otro'];

  // Control de edición en la tabla
  editingIndex: number | null = null;
  editingField: string = '';

  // Objeto temporal para nuevos ingres
  newIncome = {
    nombre: '',
    categoria: 'Fijo',
    valor: 0
  };

  // Método para inicializar el componente
  ngOnInit() {
    this.loadIncomes();
  }

  // Cargar los ingresos desde el JSON
  loadIncomes() {
    this.http.get<any>('/assets/json/income.json').subscribe({
      next: (data) => {
        this.incomes = data.ingresos;
      }
    });
  }

  // Método para abrir y cerrar el modal
  openModal() {
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para agregar un nuevo ingreso
  addIncome() {
    this.incomes.push({ ...this.newIncome });
    this.closeModal();
  }

  // Método para obtener el total de
  getTotalIncome(): number {
    return this.incomes.reduce((sum, income) => sum + income.valor, 0);
  }

  // Método para formatear el valor a moneda
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // Método para editar un campo de la tabla
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
