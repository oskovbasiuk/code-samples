import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationsControllerService {
  constructor(private http: HttpClient) {}

  public getUnreadNotificationsCount(): Observable<number> {
    return this.http.get<number>('notification/unread-count');
  }
}
