// wallet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WalletAccount } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly MOCK_DATA_URL = '/assets/json/data.json';
  private walletCache: WalletAccount[] = [];

  constructor(private http: HttpClient) {}

  getWallet(): Observable<WalletAccount[]> {
    if (this.walletCache.length > 0) {
      return of(this.walletCache);
    }

    return this.http.get<{ cartera: WalletAccount[] }>(this.MOCK_DATA_URL).pipe(
      map(response => {
        this.walletCache = response.cartera;
        return this.walletCache;
      }),
      catchError(error => {
        console.error('[WalletService] Error al cargar cartera:', error);
        return of([]);
      })
    );
  }

  addAccount(account: WalletAccount): Observable<WalletAccount[]> {
    this.walletCache.push(account);
    return of(this.walletCache);
  }

  updateAccount(index: number, updated: WalletAccount): Observable<WalletAccount[]> {
    if (this.walletCache[index]) {
      this.walletCache[index] = updated;
    }
    return of(this.walletCache);
  }

  deleteAccount(index: number): Observable<WalletAccount[]> {
    this.walletCache.splice(index, 1);
    return of(this.walletCache);
  }

  clearCache(): void {
    this.walletCache = [];
  }
}
