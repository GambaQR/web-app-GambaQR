import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RestaurantRequest {
  name: string;
  description: string;
  location: string;
}

export interface RestaurantResponse {
  id: number;
  name: string;
  description: string;
  location: string;
  ownerUsername: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly apiUrl = 'http://localhost:8080/api/restaurants'; // Ajusta si es necesario

  constructor(
    private readonly http: HttpClient
  ) { }

  createRestaurant(request: RestaurantRequest, username: string): Observable<RestaurantResponse> {
    return this.http.post<RestaurantResponse>(`${this.apiUrl}/create?username=${username}`, request);
  }

  getAllRestaurants(): Observable<RestaurantResponse[]> {
    return this.http.get<RestaurantResponse[]>(`${this.apiUrl}/all`);
  }

  getRestaurantById(id: number): Observable<RestaurantResponse> {
    return this.http.get<RestaurantResponse>(`${this.apiUrl}/${id}`);
  }

  updateRestaurant(id: number, request: RestaurantRequest, username: string): Observable<RestaurantResponse> {
    return this.http.put<RestaurantResponse>(`${this.apiUrl}/update/${id}?username=${username}`, request);
  }

  deleteRestaurant(id: number, username: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?username=${username}`);
  }
}
