import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent implements AfterViewInit {
  stats = {
    expenses: 1850000,
    income: 2500000,
    savings: 650000
  };

  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('pieChart') pieChartRef!: ElementRef;

  // 📅 Variables para el modal de meses
  showMonthModal = false;
  months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  selectedMonth: number = new Date().getMonth(); // 📌 Mes actual por defecto

  ngAfterViewInit() {
    this.createBarChart();
    this.createPieChart();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }

  // 🔹 Métodos para el modal de meses
  openMonthModal() {
    this.showMonthModal = true;
  }

  closeMonthModal() {
    this.showMonthModal = false;
  }

  selectMonth(index: number) {
    this.selectedMonth = index;
    this.closeMonthModal();
    console.log(`Mes seleccionado: ${this.months[index]}`);
  }

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
