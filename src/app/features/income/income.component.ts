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
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  incomes: any[] = [];
  isModalOpen: boolean = false;
  categorias: string[] = ['Fijo', 'Variable', 'Otro'];

  newIncome = {
    nombre: '',
    categoria: 'Fijo',
    valor: 0
  };

  editingIndex: number | null = null;
  editingField: string = '';

  ngOnInit() {
    this.loadIncomes();
  }

  loadIncomes() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        this.incomes = data.ingresos;
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addIncome() {
    this.incomes.push({ ...this.newIncome });
    this.closeModal();
  }

  getTotalIncome(): number {
    return this.incomes.reduce((sum, income) => sum + income.valor, 0);
  }

  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }

  editField(index: number, field: string) {
    this.editingIndex = index;
    this.editingField = field;
  }

  saveEdit() {
    this.editingIndex = null;
    this.editingField = '';
  }
}
