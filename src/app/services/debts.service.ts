// debt.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Debt } from '../models/debt.model';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private readonly MOCK_DATA_URL = '/assets/json/data.json';
  private debtCache: Debt[] = [];

  constructor(private http: HttpClient) {}

  getDebts(): Observable<Debt[]> {
    if (this.debtCache.length > 0) {
      return of(this.debtCache);
    }

    return this.http.get<{ deudas: Debt[] }>(this.MOCK_DATA_URL).pipe(
      map(response => {
        this.debtCache = response.deudas;
        return this.debtCache;
      }),
      catchError(error => {
        console.error('[DebtService] Error al cargar deudas:', error);
        return of([]);
      })
    );
  }

  addDebt(debt: Debt): Observable<Debt[]> {
    this.debtCache.push(debt);
    return of(this.debtCache);
  }

  updateDebt(index: number, updated: Debt): Observable<Debt[]> {
    if (this.debtCache[index]) {
      this.debtCache[index] = updated;
    }
    return of(this.debtCache);
  }

  deleteDebt(index: number): Observable<Debt[]> {
    this.debtCache.splice(index, 1);
    return of(this.debtCache);
  }

  clearCache(): void {
    this.debtCache = [];
  }
}
