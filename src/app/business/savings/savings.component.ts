import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css'],
  providers: [DecimalPipe]
})
export default class SavingsComponent implements OnInit {
  private http = inject(HttpClient);
  private decimalPipe = inject(DecimalPipe);

  savings: any[] = [];

  ngOnInit() {
    this.loadSavings();
  }

  // 🔹 Cargar los ahorros desde `data.json`
  loadSavings() {
    this.http.get<any>('/assets/data.json').subscribe({
      next: (data) => {
        console.log('✅ JSON de ahorros cargado:', data);
        this.savings = data.ahorros;
      },
      error: (err) => {
        console.error('❌ Error al cargar JSON de ahorros:', err);
      }
    });
  }

  // 🔹 Método para calcular el total ahorrado
  getTotalSavings(): number {
    return this.savings.reduce((sum, account) => sum + account.valor, 0);
  }

  // 🔹 Método para formatear valores de moneda manualmente
  formatCurrency(value: number): string {
    return this.decimalPipe.transform(value, '1.0-0') || '';
  }
}
