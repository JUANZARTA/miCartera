import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export default class HomeComponent {
  // Variables
  showMonthModal = false;
  months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  selectedMonth: number = new Date().getMonth();

  // Variables
  totalWallet = 2450000;
  totalIncome = 2156800;
  totalSavings = 1500000;

  // Variables
  expenses = [
    { name: "Renta", value: 120000 },
    { name: "Comida", value: 40000 },
    { name: "Gasolina", value: 90000 },
  ];

  // Variables
  loans = [
    { name: "James Muñoz", status: "Pendiente" },
    { name: "María González", status: "Pagado" },
    { name: "Carlos López", status: "Pendiente" },
  ];

  // Variables
  debts = [
    { name: "Banco de Bogotá", status: "Pendiente" },
    { name: "Juan López", status: "Pagado" },
    { name: "Prestamista Local", status: "Pendiente" },
  ];

  // Variables
  openMonthModal() { this.showMonthModal = true; }
  closeMonthModal() { this.showMonthModal = false; }
  selectMonth(index: number) { this.selectedMonth = index; this.closeMonthModal(); }
}
