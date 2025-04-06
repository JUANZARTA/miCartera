// savings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Saving } from '../models/savings.model';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {
  private readonly MOCK_DATA_URL = '/assets/json/data.json';
  private savingsCache: Saving[] = [];

  constructor(private http: HttpClient) {}

  getSavings(): Observable<Saving[]> {
    if (this.savingsCache.length > 0) {
      return of(this.savingsCache);
    }

    return this.http.get<{ ahorros: Saving[] }>(this.MOCK_DATA_URL).pipe(
      map(response => {
        this.savingsCache = response.ahorros;
        return this.savingsCache;
      }),
      catchError(error => {
        console.error('[SavingsService] Error al cargar ahorros:', error);
        return of([]);
      })
    );
  }

  addSaving(saving: Saving): Observable<Saving[]> {
    this.savingsCache.push(saving);
    return of(this.savingsCache);
  }

  updateSaving(index: number, updated: Saving): Observable<Saving[]> {
    if (this.savingsCache[index]) {
      this.savingsCache[index] = updated;
    }
    return of(this.savingsCache);
  }

  deleteSaving(index: number): Observable<Saving[]> {
    this.savingsCache.splice(index, 1);
    return of(this.savingsCache);
  }

  clearCache(): void {
    this.savingsCache = [];
  }
}
