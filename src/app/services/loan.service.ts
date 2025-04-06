// loan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly MOCK_DATA_URL = '/assets/json/data.json';
  private loansCache: Loan[] = [];

  constructor(private http: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    if (this.loansCache.length > 0) {
      return of(this.loansCache);
    }

    return this.http.get<{ prestamos: Loan[] }>(this.MOCK_DATA_URL).pipe(
      map(response => {
        this.loansCache = response.prestamos;
        return this.loansCache;
      }),
      catchError(error => {
        console.error('[LoanService] Error al cargar préstamos:', error);
        return of([]);
      })
    );
  }

  addLoan(loan: Loan): Observable<Loan[]> {
    this.loansCache.push(loan);
    return of(this.loansCache);
  }

  updateLoan(index: number, updated: Loan): Observable<Loan[]> {
    if (this.loansCache[index]) {
      this.loansCache[index] = updated;
    }
    return of(this.loansCache);
  }

  deleteLoan(index: number): Observable<Loan[]> {
    this.loansCache.splice(index, 1);
    return of(this.loansCache);
  }

  clearCache(): void {
    this.loansCache = [];
  }
}
