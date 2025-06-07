import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductResponse {
  category: any;
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
export interface ProductRequest {
  categoryId: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  tax: number;
  currency: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'http://localhost:8080/api/products';

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/all`);
  }
    getProductByRestaurantId(restaurantId: number): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/by-restaurant/${restaurantId}`);
  }
  createProduct(productData: ProductRequest, imageFile: File | null): Observable<ProductResponse> {
    const formData = new FormData();

    // Añade los datos del producto como un objeto JSON convertido a String
    formData.append('product', JSON.stringify(productData));

    // Añade el archivo de imagen solo si existe
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }
    // Si tu backend espera un campo "image" incluso si está vacío,
    // puedes añadir: formData.append('image', new Blob()); o formData.append('image', '');
    // Pero 'Required part 'image' is not present' sugiere que lo espera o no.

    // La cabecera 'Content-Type' se establece automáticamente a 'multipart/form-data'
    // cuando usas FormData, NO la establezcas manualmente.
    return this.http.post<ProductResponse>(`${this.apiUrl}/create`, formData);
  }
  updateProduct(productId: number, productData: ProductRequest, imageFile: File | null): Observable<ProductResponse> {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }
    return this.http.put<ProductResponse>(`${this.apiUrl}/update/${productId}`, formData);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${productId}`);
  }

}