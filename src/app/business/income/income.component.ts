import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
  providers: [DecimalPipe]
})
export default class IncomeComponent implements OnInit {
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  incomes: any[] = [];

  ngOnInit() {
    this.loadIncomes();
  }

  // 🔹 Cargar los ingresos desde `data.json`
  loadIncomes() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        console.log('✅ JSON de ingresos cargado:', data);
        this.incomes = data.ingresos;
      },
      error: (err) => {
        console.error('❌ Error al cargar JSON de ingresos:', err);
      }
    });
  }

  // 🔹 Método para calcular el total de ingresos
  getTotalIncome(): number {
    return this.incomes.reduce((sum, income) => sum + income.valor, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
