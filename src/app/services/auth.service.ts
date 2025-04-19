import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiKey = 'AIzaSyBzluPST056-3rTmei5t38M6GaF9CNCo2Q';
  private baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';

  constructor(private http: HttpClient) {}

  // método: Iniciar sesión con correo y contraseña
  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}:signInWithPassword?key=${this.apiKey}`;
    const body = { email, password, returnSecureToken: true };

    return this.http.post(url, body).pipe(
      tap((res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
      }),
      catchError((err) => {
        return throwError(() => err.error.error.message);
      })
    );
  }

  // método: Cerrar sesión y limpiar localStorage
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedYear');
    localStorage.removeItem('selectedMonth');
  }

  // método: Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('user');
    }
    return false;
  }

  // método: Obtener datos del usuario guardados en localStorage
  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // método: Registrar un nuevo usuario con correo y contraseña
  register(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}:signUp?key=${this.apiKey}`;
    const body = { email, password, returnSecureToken: true };

    return this.http.post(url, body).pipe(
      tap((res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
      }),
      catchError((err) => {
        return throwError(() => err.error.error.message);
      })
    );
  }

  // método: Guardar perfil de usuario en la base de datos al momento de registrarse
  saveUserProfile(userId: string, name: string, correo: string): Observable<any> {
    const url = `https://micartera-acd5b-default-rtdb.firebaseio.com/${userId}.json`;

    return this.http.put(url, {
      nombre: name,
      correo: correo,
      notificaciones: {
        "-notif1": {
          mensaje: "Bienvenido a MiCartera",
          leido: false,
          fecha: new Date().toLocaleString() // guardado con hora local
        }
      }
    }).pipe(
      tap(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.name = name;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }),
      catchError(() => throwError(() => 'Error al guardar perfil'))
    );
  }

  // método: Obtener todos los datos del usuario desde Firebase (por su UID)
  getUserData(uid: string): Observable<any> {
    const url = `https://micartera-acd5b-default-rtdb.firebaseio.com/${uid}.json`;
    return this.http.get<any>(url);
  }

  // método: Obtener notificaciones del usuario
  getUserNotifications(uid: string): Observable<any> {
    const url = `https://micartera-acd5b-default-rtdb.firebaseio.com/${uid}/notificaciones.json`;
    return this.http.get<any>(url);
  }

  // método: Marcar una notificación como leída
  markNotificationAsRead(uid: string, notifId: string): Observable<any> {
    const url = `https://micartera-acd5b-default-rtdb.firebaseio.com/${uid}/notificaciones/${notifId}/leido.json`;
    return this.http.put(url, true);
  }

  // método: Agregar manualmente una notificación
  addNotification(uid: string, mensaje: string): Observable<any> {
    const url = `https://micartera-acd5b-default-rtdb.firebaseio.com/${uid}/notificaciones.json`;
    const body = {
      mensaje,
      leido: false,
      fecha: new Date().toLocaleString() // guardado con hora local
    };
    return this.http.post(url, body);
  }
}
