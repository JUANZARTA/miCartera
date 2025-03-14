// debts.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Debt } from '../models/debt.model'; // Asegúrate que la ruta del import es correcta

@Injectable({
  providedIn: 'root'
})
export class DebtsService {
  debts: any[] = [];

  newDebt = {
    acreedor: '',
    fecha_deuda: '',
    fecha_pago: '',
    valor: 0,
    estado: 'Pendiente'
  };

  constructor(private http: HttpClient) { }


    // Método para cargar las deudas
    loadDebts() {
      this.http.get<any>('/assets/json/debts.json').subscribe({
        next: (data) => {
          this.debts = data.deudas;
        }
      });
    }

}
