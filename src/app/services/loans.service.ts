import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Loan } from '../models/loans.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly FIREBASE_BASE_URL = 'https://micartera-acd5b-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  // 🔹 GET: Obtener todos los préstamos de un mes/año/usuario
  getLoans(userId: string, year: string, month: string): Observable<{ [key: string]: Loan }> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/prestamos.json`;
    return this.http.get<{ [key: string]: Loan }>(url).pipe(
      map(data => data || {}),
      catchError(error => {
        console.error('[GET] Error al obtener préstamos:', error);
        return of({});
      })
    );
  }

  // 🔹 POST: Agregar nuevo préstamo
  addLoan(userId: string, year: string, month: string, loan: Loan): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/prestamos.json`;
    return this.http.post(url, loan).pipe(
      catchError(error => {
        console.error('[POST] Error al agregar préstamo:', error);
        return of(null);
      })
    );
  }

  // 🔹 PUT: Actualizar un préstamo existente
  updateLoan(userId: string, year: string, month: string, loanId: string, loan: Loan): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/prestamos/${loanId}.json`;
    return this.http.put(url, loan).pipe(
      catchError(error => {
        console.error('[PUT] Error al actualizar préstamo:', error);
        return of(null);
      })
    );
  }

  // 🔹 DELETE: Eliminar un préstamo
  deleteLoan(userId: string, year: string, month: string, loanId: string): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/prestamos/${loanId}.json`;
    return this.http.delete(url).pipe(
      catchError(error => {
        console.error('[DELETE] Error al eliminar préstamo:', error);
        return of(null);
      })
    );
  }
}
