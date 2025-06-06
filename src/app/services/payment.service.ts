import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private apiUrl = 'http://localhost:8080/payment';

    constructor(private http: HttpClient) { }

    createPaymentIntent(amount: number, currency: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/create-payment-intent`, null, {
            params: {
                amount,
                currency
            },
            responseType: 'text'
        });
    }

    savePayment(paymentData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/save`, paymentData);
    }
}