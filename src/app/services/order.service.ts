import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) { }

  createOrder(order: any, userId: number): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/create?userId=${userId}`, order);
  }
}
