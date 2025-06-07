import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentRequest {
    amount: number;
    currency: string;
    paymentMethod?: string;
}

export interface PaymentResponse {
    clientSecret: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = 'http://localhost:8080/api/payments';
    private stripePublicKey = 'pk_test_51RTm0rBMZ4jNGuBpQDbmO8w0gquvl2tO1JqtXoQk3MrrsQuy7W3GCAsfETVD69lsZ9S4OGNYsdyJUOlLcC3DiylI004CARHHM7';

    constructor(private http: HttpClient) { }

    getStripePublicKey(): string {
        return this.stripePublicKey;

        //return this.http.get<string>(`${this.apiUrl}/public-key`,);
    }

    createPaymentIntent(request: PaymentRequest): Observable<PaymentResponse> {
        return this.http.post<PaymentResponse>(`${this.apiUrl}/create-payment-intent`, request);
    }

    savePayment(paymentData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/save-payment`, paymentData);
    }

    createCheckoutSession(orderId: number): Observable<{ url: string }> {
        return this.http.post<{ url: string }>(`http://localhost:8080/api/payments/checkout/${orderId}`, {});
    }

}
