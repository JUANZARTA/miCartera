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
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  savings: any[] = [];
  isModalOpen: boolean = false;

  newSaving = {
    tipo: '',
    valor: 0
  };

  editingIndex: number | null = null;
  editingField: string = '';

  ngOnInit() {
    this.loadSavings();
  }

  loadSavings() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        this.savings = data.ahorros;
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addSaving() {
    this.savings.push({ ...this.newSaving });
    this.closeModal();
  }

  getTotalSavings(): number {
    return this.savings.reduce((sum, account) => sum + account.valor, 0);
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
