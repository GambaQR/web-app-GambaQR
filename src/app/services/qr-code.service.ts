import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QrCodeRequest {
  restaurantId: number;
  tableNumber: number;
  qrUrl: string;
  isGeneral: boolean;
}

export interface QrCodeResponse {
  id: number;
  restaurantId: number;
  tableNumber: number;
  qrUrl: string;
  isGeneral: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  private apiUrl = 'http://localhost:8080/api/qrcodes'; // Ajustar según el backend

  constructor(private http: HttpClient) { }

  createQrCode(request: QrCodeRequest): Observable<QrCodeResponse> {
    return this.http.post<QrCodeResponse>(`${this.apiUrl}/create`, request);
  }

  getQrCodesByRestaurant(restaurantId: number): Observable<QrCodeResponse[]> {
    return this.http.get<QrCodeResponse[]>(`${this.apiUrl}/restaurant/${restaurantId}`);
  }
}

