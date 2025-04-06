import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  // FUTURO: Cambiar esta URL por la de tu API (ej: 'https://api.tuservidor.com/expenses')
  private readonly MOCK_DATA_URL = '/assets/json/data.json';

  // Cache local temporal (solo en runtime)
  private expensesCache: Expense[] = [];

  constructor(private http: HttpClient) {}

  // Obtener todos los gastos
  getExpenses(): Observable<Expense[]> {
    if (this.expensesCache.length > 0) {
      return of(this.expensesCache);
    }

    return this.http.get<{ gastos: Expense[] }>(this.MOCK_DATA_URL).pipe(
      map(response => {
        this.expensesCache = response.gastos;
        return this.expensesCache;
      }),
      catchError(error => {
        console.error('[ExpenseService] Error al cargar los gastos:', error);
        return of([]);
      })
    );
  }

  // Obtener un solo gasto por índice
  getExpenseByIndex(index: number): Observable<Expense | undefined> {
    return this.getExpenses().pipe(
      map(gastos => gastos[index])
    );
  }

  // Agregar un gasto (solo en memoria)
  addExpense(newExpense: Expense): Observable<Expense[]> {
    this.expensesCache.push(newExpense);
    return of(this.expensesCache);
  }

  // Actualizar un gasto por índice (solo en memoria)
  updateExpense(index: number, updatedExpense: Expense): Observable<Expense[]> {
    if (this.expensesCache[index]) {
      this.expensesCache[index] = updatedExpense;
    }
    return of(this.expensesCache);
  }

  // Eliminar un gasto por índice (solo en memoria)
  deleteExpense(index: number): Observable<Expense[]> {
    this.expensesCache.splice(index, 1);
    return of(this.expensesCache);
  }

  // Limpiar el cache (opcional)
  clearCache(): void {
    this.expensesCache = [];
  }

}
