import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Debt } from '../models/debt.model';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private readonly FIREBASE_BASE_URL = 'https://micartera-acd5b-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  // 🔹 GET: Obtener todas las deudas de un mes/año/usuario
  getDebts(userId: string, year: string, month: string): Observable<{ [key: string]: Debt }> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/deudas.json`;
    return this.http.get<{ [key: string]: Debt }>(url).pipe(
      map(data => data || {}),
      catchError(error => {
        console.error('[GET] Error al obtener deudas:', error);
        return of({});
      })
    );
  }

  // 🔹 POST: Agregar nueva deuda
  addDebt(userId: string, year: string, month: string, debt: Debt): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/deudas.json`;
    return this.http.post(url, debt).pipe(
      catchError(error => {
        console.error('[POST] Error al agregar deuda:', error);
        return of(null);
      })
    );
  }

  // 🔹 PUT: Actualizar una deuda existente
  updateDebt(userId: string, year: string, month: string, debtId: string, debt: Debt): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/deudas/${debtId}.json`;
    return this.http.put(url, debt).pipe(
      catchError(error => {
        console.error('[PUT] Error al actualizar deuda:', error);
        return of(null);
      })
    );
  }

  // 🔹 DELETE: Eliminar una deuda
  deleteDebt(userId: string, year: string, month: string, debtId: string): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/deudas/${debtId}.json`;
    return this.http.delete(url).pipe(
      catchError(error => {
        console.error('[DELETE] Error al eliminar deuda:', error);
        return of(null);
      })
    );
  }


}
