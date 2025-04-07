import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly FIREBASE_BASE_URL = 'https://micartera-acd5b-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  // 🔹 GET: Obtener todos los gastos de un mes/año/usuario
  getExpenses(userId: string, year: string, month: string): Observable<{ [key: string]: Expense }> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/gastos.json`;
    return this.http.get<{ [key: string]: Expense }>(url).pipe(
      map(data => data || {}),
      catchError(error => {
        console.error('[GET] Error al obtener gastos:', error);
        return of({});
      })
    );
  }

  // 🔹 POST: Agregar un nuevo gasto
  addExpense(userId: string, year: string, month: string, expense: Expense): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/gastos.json`;
    return this.http.post(url, expense).pipe(
      catchError(error => {
        console.error('[POST] Error al agregar gasto:', error);
        return of(null);
      })
    );
  }

  // 🔹 PUT: Actualizar un gasto existente
  updateExpense(userId: string, year: string, month: string, expenseId: string, expense: Expense): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/gastos/${expenseId}.json`;
    return this.http.put(url, expense).pipe(
      catchError(error => {
        console.error('[PUT] Error al actualizar gasto:', error);
        return of(null);
      })
    );
  }

  // 🔹 DELETE: Eliminar un gasto
  deleteExpense(userId: string, year: string, month: string, expenseId: string): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/gastos/${expenseId}.json`;
    return this.http.delete(url).pipe(
      catchError(error => {
        console.error('[DELETE] Error al eliminar gasto:', error);
        return of(null);
      })
    );
  }
}
