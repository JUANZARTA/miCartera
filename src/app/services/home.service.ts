// home.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WalletAccount } from '../models/wallet.model';
import { Debt } from '../models/debt.model';
import { Loan } from '../models/loans.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly DATA_URL = '/assets/json/data.json';

  constructor(private http: HttpClient) {}

  getWallet(): Observable<WalletAccount[]> {
    return this.http.get<any>(this.DATA_URL).pipe(
      map(data => data.cartera || []),
      catchError(err => {
        console.error('Error al cargar cartera', err);
        return of([]);
      })
    );
  }

  getDebts(): Observable<Debt[]> {
    return this.http.get<any>(this.DATA_URL).pipe(
      map(data => data.deudas || []),
      catchError(err => {
        console.error('Error al cargar deudas', err);
        return of([]);
      })
    );
  }

  getLoans(): Observable<Loan[]> {
    return this.http.get<any>(this.DATA_URL).pipe(
      map(data => data.prestamos || []),
      catchError(err => {
        console.error('Error al cargar préstamos', err);
        return of([]);
      })
    );
  }
}
