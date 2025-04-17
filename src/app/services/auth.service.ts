import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiKey = 'AIzaSyBzluPST056-3rTmei5t38M6GaF9CNCo2Q'; // <-- Reemplázalo con tu API Key de Firebase (desde Project Settings > Web API Key)
  private baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}:signInWithPassword?key=${this.apiKey}`;
    const body = {
      email,
      password,
      returnSecureToken: true
    };

    return this.http.post(url, body).pipe(
      tap((res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
      }),
      catchError((err) => {
        return throwError(() => err.error.error.message);
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedYear');
    localStorage.removeItem('selectedMonth');
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('user');
    }
    return false;
  }


  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  register(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}:signUp?key=${this.apiKey}`;
    const body = {
      email,
      password,
      returnSecureToken: true
    };

    return this.http.post(url, body).pipe(
      tap((res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
      }),
      catchError((err) => {
        return throwError(() => err.error.error.message);
      })
    );
  }

  saveUserProfile(userId: string, name: string): Observable<any> {
    const url = `https://app-finanzas-58d02-default-rtdb.firebaseio.com/users/${userId}.json`;

    return this.http.put(url, { name }).pipe(
      tap(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.name = name;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }),
      catchError((err) => {
        return throwError(() => 'Error al guardar perfil');
      })
    );
  }



}
