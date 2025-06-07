import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = 'http://localhost:8080/api/categories';

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/all`);
  }
  createCategory(category: Omit<CategoryResponse, 'id'>): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(`${this.apiUrl}/create`, category);
  }
}

