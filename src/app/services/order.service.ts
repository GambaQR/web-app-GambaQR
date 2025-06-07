import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OrderDetailSimplifiedDTO {
  productId: number;
  quantity: number;
  name?: string; // Add if used in HTML
  notes?: string; // Add if used in HTML
}

export interface OrderRequestDTO {
  status: string;
  // Add any other fields your backend expects for an order update
  // e.g., products?: OrderDetailSimplifiedDTO[];
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
  products: OrderDetailSimplifiedDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly baseUrl = 'http://localhost:8080/orders';

  constructor(
    private readonly http: HttpClient
  ) { }

  createOrder(order: any, userId: number): Observable<OrderResponseDTO> {
    return this.http.post<OrderResponseDTO>(`${this.baseUrl}/create?userId=${userId}`, order);
  }

  // ¡NUEVO MÉTODO! Agrega esto a OrderService
  updateOrder(orderId: number, request: OrderRequestDTO): Observable<OrderResponseDTO> {
    // Assuming your backend endpoint for updating an order is PUT /orders/update/{orderId}
    return this.http.put<OrderResponseDTO>(`${this.baseUrl}/update/${orderId}`, request);
  }
}