import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateService } from '../../../services/date.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  showMonthModal = false;
  years: number[] = [];
  months: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  selectedYear: number | null = null;
  selectedMonth: number | null = null;

  currentYear: string = '';
  currentMonth: string = '';
  currentRoute: string = '';

  userName: string = ''; // Para mostrar nombre si luego se quiere

  private dateSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(private dateService: DateService, private router: Router) {}

  ngOnInit(): void {
    this.generateYearRange(2025, 2050);

    // Obtener la fecha actual
    const today = new Date();
    const defaultYear = today.getFullYear();
    const defaultMonth = today.getMonth(); // 0-indexed

    const savedYear = this.dateService.getSelectedYear();
    const savedMonth = this.dateService.getSelectedMonth();

    if (savedYear && savedMonth) {
      this.selectedYear = parseInt(savedYear);
      this.selectedMonth = parseInt(savedMonth) - 1;
      this.dateService.setDate(this.selectedYear, this.selectedMonth + 1);
    } else {
      this.selectedYear = defaultYear;
      this.selectedMonth = defaultMonth;
      this.dateService.setDate(defaultYear, defaultMonth + 1);
    }


    // Escucha la selección actual de año y mes
    this.dateSubscription = this.dateService.selectedDate$.subscribe(({ year, month }) => {
      this.currentYear = year ?? '';
      this.currentMonth = month ?? '';
    });

    // Escucha cambios de ruta para el breadcrumb
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const path = event.urlAfterRedirects.split('/');
        this.currentRoute = this.mapRouteToTitle(path[path.length - 1]);
      }
    });
  }

  ngOnDestroy(): void {
    this.dateSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  generateYearRange(start: number, end: number): void {
    this.years = [];
    for (let year = start; year <= end; year++) {
      this.years.push(year);
    }
  }

  openMonthModal(): void {
    this.showMonthModal = true;
  }

  closeMonthModal(): void {
    this.showMonthModal = false;
  }

  clearYearSelection(): void {
    this.selectedYear = null;
  }

  selectYear(year: number): void {
    this.selectedYear = year;
  }

  selectMonth(monthIndex: number): void {
    this.selectedMonth = monthIndex;
    this.showMonthModal = false;

    const mes = monthIndex + 1;
    this.dateService.setDate(this.selectedYear!, mes);
    console.log('Fecha seleccionada →', this.selectedYear, mes);
  }

  mapRouteToTitle(route: string): string {
    switch (route) {
      case 'expense': return 'Gastos';
      case 'income': return 'Ingresos';
      case 'wallet': return 'Cartera';
      case 'saving': return 'Ahorros';
      case 'loan': return 'Préstamos';
      case 'debt': return 'Deudas';
      case 'home': return 'Inicio';
      default: return this.capitalize(route);
    }
  }

  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
