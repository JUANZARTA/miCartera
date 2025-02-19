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
  // 📅 Variables para el modal de meses
  showMonthModal = false;
  months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  selectedMonth: number = new Date().getMonth(); // 📌 Mes actual por defecto

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
}
