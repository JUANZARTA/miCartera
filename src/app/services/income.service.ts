// income.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Income } from '../models/income.model';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private readonly MOCK_DATA_URL = '/assets/json/data.json';
  private incomesCache: Income[] = [];

  constructor(private http: HttpClient) {}

  getIncomes(): Observable<Income[]> {
    if (this.incomesCache.length > 0) {
      return of(this.incomesCache);
    }

    return this.http.get<{ ingresos: Income[] }>(this.MOCK_DATA_URL).pipe(
      map(response => {
        this.incomesCache = response.ingresos;
        return this.incomesCache;
      }),
      catchError(error => {
        console.error('[IncomeService] Error al cargar ingresos:', error);
        return of([]);
      })
    );
  }

  getIncomeByIndex(index: number): Observable<Income | undefined> {
    return this.getIncomes().pipe(
      map(incomes => incomes[index])
    );
  }

  addIncome(newIncome: Income): Observable<Income[]> {
    this.incomesCache.push(newIncome);
    return of(this.incomesCache);
  }

  updateIncome(index: number, updatedIncome: Income): Observable<Income[]> {
    if (this.incomesCache[index]) {
      this.incomesCache[index] = updatedIncome;
    }
    return of(this.incomesCache);
  }

  deleteIncome(index: number): Observable<Income[]> {
    this.incomesCache.splice(index, 1);
    return of(this.incomesCache);
  }

  clearCache(): void {
    this.incomesCache = [];
  }
}
