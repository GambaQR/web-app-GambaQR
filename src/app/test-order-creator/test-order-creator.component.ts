import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para componentes standalone
import { OrderRealtimeService } from '../services/order-realtime.service';
import { KitchenDisplayComponent } from "../kitchen-display/kitchen-display.component"; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-test-order-creator',
  standalone: true,
  imports: [CommonModule, KitchenDisplayComponent],
  templateUrl: './test-order-creator.component.html',
})
export class TestOrderCreatorComponent {

  constructor(
    private readonly orderRealtimeService: OrderRealtimeService
  ) { }

  /**
   * Método que se llama al hacer click en el botón de prueba.
   * Llama al método createTestOrder del servicio de tiempo real.
   */
  createTestOrder(): void {
    console.log('Attempting to create a test order via Supabase...');
    this.orderRealtimeService.createTestOrder().then(order => {
      if (order) {
        console.log('Test order created successfully and sent to Supabase. Check your Kitchen Display!');
      } else {
        console.warn('Failed to create test order. Check console for errors (e.g., RLS, foreign key constraints).');
      }
    }).catch(error => {
      console.error('An unexpected error occurred while creating test order:', error);
    });
  }
}