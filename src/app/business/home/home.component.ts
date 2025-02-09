import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // ✅ Registra los componentes de Chart.js

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ Importamos RouterModule para navegación
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent implements AfterViewInit {
  // 🔹 Datos estadísticos (pueden venir de un servicio en el futuro)
  stats = {
    expenses: 1850000,
    income: 2500000,
    savings: 650000
  };

  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('pieChart') pieChartRef!: ElementRef;

  ngAfterViewInit() {
    this.createBarChart();
    this.createPieChart();
  }

  // 🔹 Método para formatear números como moneda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }

  // 🔹 Crear gráfico de barras
  createBarChart() {
    new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Gastos', 'Ingresos', 'Ahorros'],
        datasets: [{
          label: 'Estadísticas Financieras',
          data: [this.stats.expenses, this.stats.income, this.stats.savings],
          backgroundColor: ['#EF4444', '#10B981', '#3B82F6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // 🔹 Crear gráfico de pastel
  createPieChart() {
    new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Gastos', 'Ingresos', 'Ahorros'],
        datasets: [{
          data: [this.stats.expenses, this.stats.income, this.stats.savings],
          backgroundColor: ['#EF4444', '#10B981', '#3B82F6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
