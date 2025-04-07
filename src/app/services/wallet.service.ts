import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WalletAccount } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly FIREBASE_BASE_URL = 'https://micartera-acd5b-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  // 🔹 GET: Obtener cuentas de cartera
  getWallet(userId: string, year: string, month: string): Observable<{ [key: string]: WalletAccount }> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/cartera.json`;
    return this.http.get<{ [key: string]: WalletAccount }>(url).pipe(
      map(data => data || {}),
      catchError(error => {
        console.error('[GET] Error al obtener cartera:', error);
        return of({});
      })
    );
  }

  // 🔹 POST: Agregar cuenta nueva
  addAccount(userId: string, year: string, month: string, account: WalletAccount): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/cartera.json`;
    return this.http.post(url, account).pipe(
      catchError(error => {
        console.error('[POST] Error al agregar cuenta:', error);
        return of(null);
      })
    );
  }

  // 🔹 PUT: Actualizar cuenta existente
  updateAccount(userId: string, year: string, month: string, accountId: string, account: WalletAccount): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/cartera/${accountId}.json`;
    return this.http.put(url, account).pipe(
      catchError(error => {
        console.error('[PUT] Error al actualizar cuenta:', error);
        return of(null);
      })
    );
  }

  // 🔹 DELETE: Eliminar cuenta
  deleteAccount(userId: string, year: string, month: string, accountId: string): Observable<any> {
    const url = `${this.FIREBASE_BASE_URL}/${userId}/${year}/${month}/cartera/${accountId}.json`;
    return this.http.delete(url).pipe(
      catchError(error => {
        console.error('[DELETE] Error al eliminar cuenta:', error);
        return of(null);
      })
    );
  }
}
