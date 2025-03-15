import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, FormsModule], // Asegurar que FormsModule está importado
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
  providers: [DecimalPipe],
})
export default class ExpenseComponent implements OnInit {
  // Inyección de dependencias
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  // Variables
  expenses: any[] = [];
  isModalOpen: boolean = false;

  // Control de edición en la tabla
  editingIndex: number | null = null;
  editingField: string = '';

  // Lista de categorías disponibles
  categorias: string[] = ['Variable', 'Fija', 'Emergencia', 'Otro'];

  // Objeto temporal para nuevos gastos
  newExpense = {
    descripcion: '',
    categoria: 'Variable', // Categoría por defecto
    valor: 0,
    estimacion: 0,
  };  

  // Método para inicializar el componente
  ngOnInit() {
    this.loadExpenses();
  }

  // Cargar los gastos desde el JSON
  loadExpenses() {
    this.http.get<any>('/assets/json/expense.json').subscribe({
      next: (data) => {
        //console.log('📌 JSON cargado correctamente:', data);
        this.expenses = data.gastos;
      },
      error: (err) => {
        //console.error('❌ Error al cargar JSON:', err);
      },
    });
  }

  // Abrir modal para agregar nuevo gasto
  openModal() {
    this.isModalOpen = true;
  }

  // Cerrar modal y resetear formulario
  closeModal() {
    this.isModalOpen = false;
    this.newExpense = {
      descripcion: '',
      categoria: 'Variable',
      valor: 0,
      estimacion: 0,
    };
  }

  // Agregar nuevo gasto a la tabla
  addExpense() {
    if (!this.newExpense.descripcion || !this.newExpense.categoria) {
      alert('Por favor completa todos los campos.');
      return;
    }

    this.expenses.push({ ...this.newExpense }); // Agrega el gasto
    this.closeModal(); // Cierra el modal
  }

  // Método para calcular el total de gastos reales
  getTotalExpenses(): number {
    return this.expenses.reduce(
      (sum, expense) => sum + Number(expense.valor),
      0
    );
  }

  // Método para calcular el total estimado
  getTotalEstimated(): number {
    return this.expenses.reduce(
      (sum, expense) => sum + Number(expense.estimacion),
      0
    );
  }

  // Formateo de moneda
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  // Método para detectar si el gasto real es mayor que la estimación
  isOverBudget(expense: { valor: number; estimacion: number }): boolean {
    return Number(expense.valor) > Number(expense.estimacion);
  }

  // Activar edición en la tabla
  editField(index: number, field: string) {
    this.editingIndex = index;
    this.editingField = field;
  }

  // Guardar cambios en la celda editada
  saveEdit() {
    if (this.editingIndex !== null && this.editingField) {
      console.log(
        `📌 Guardando cambios en ${this.editingField}:`,
        this.expenses[this.editingIndex]
      );
    }
    this.editingIndex = null;
    this.editingField = '';
  }
}
