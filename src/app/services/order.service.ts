import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderDetailDTO {
  productId?: number;
  comboId?: number;
  quantity: number;
}

export interface OrderRequestDTO {
  userId: number;
  restaurantId: number;
  tableNumber: number;
  orderDetails: OrderDetailDTO[];
}

export interface OrderResponseDTO {
  id: number;
  userId: number;
  restaurantId: number;
  tableNumber: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  products: any[];
  combos: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  createOrder(orderData: OrderRequestDTO): Observable<OrderResponseDTO> {
    return this.http.post<OrderResponseDTO>(`${this.apiUrl}/create`, orderData);
  }

  getOrderById(orderId: number): Observable<OrderResponseDTO> {
    return this.http.get<OrderResponseDTO>(`${this.apiUrl}/${orderId}`);
  }

  getOrdersByUser(userId: number): Observable<OrderResponseDTO[]> {
    return this.http.get<OrderResponseDTO[]>(`${this.apiUrl}/user/${userId}`);
  }
}