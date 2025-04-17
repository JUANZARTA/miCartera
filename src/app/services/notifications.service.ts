import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private baseUrl = 'https://app-finanzas-58d02-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) {}

  // ✅ Añadir notificación
  addNotification(userId: string, year: string, month: string, notification: any): Observable<any> {
    const url = `${this.baseUrl}/notifications/${userId}/${year}/${month}.json`;
    return this.http.post(url, notification);
  }

  // ✅ Obtener todas
  getNotifications(userId: string, year: string, month: string): Observable<any> {
    const url = `${this.baseUrl}/notifications/${userId}/${year}/${month}.json`;
    return this.http.get(url);
  }

  // ✅ Marcar como leída (opcional)
  updateNotification(userId: string, year: string, month: string, id: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/notifications/${userId}/${year}/${month}/${id}.json`;
    return this.http.patch(url, data);
  }

  // ✅ Eliminar una
  deleteNotification(userId: string, year: string, month: string, id: string): Observable<any> {
    const url = `${this.baseUrl}/notifications/${userId}/${year}/${month}/${id}.json`;
    return this.http.delete(url);
  }
}
