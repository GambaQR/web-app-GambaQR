import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importar para Reactive Forms
import { Router, RouterLink } from '@angular/router'; // Para navegación
import { CartService, CartState } from '../services/cart.service'; // Ajusta la ruta a tu servicio
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIf, NgFor, NgClass], // Asegúrate de importar lo necesario
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup; // Usaremos FormGroup para manejar los campos
  cartState!: CartState;
  private cartSubscription!: Subscription;

  isProcessing: boolean = false;

  // Calculables del resumen del pedido
  subtotal: number = 0;
  tax: number = 0;
  deliveryFee: number = 2.99;
  total: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cartService: CartService,
    private readonly router: Router
  ) {
    // Inicializar el formulario con Reactive Forms
    this.checkoutForm = this.fb.group({
      // Información del Cliente
      customerName: ['', Validators.required],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]], // Teléfono con 9-10 dígitos
      customerEmail: ['', Validators.email], // Email opcional pero validado si se introduce

      // Instrucciones Especiales
      specialInstructions: [''],

      // Método de Pago
      paymentMethod: ['card', Validators.required], // Valor por defecto 'card'

      // Información de Tarjeta (condicionalmente validada)
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: [''],
      cardName: ['']
    });

    // Validadores condicionales para la información de tarjeta
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardNumberControl = this.checkoutForm.get('cardNumber');
      const cardExpiryControl = this.checkoutForm.get('cardExpiry');
      const cardCvvControl = this.checkoutForm.get('cardCvv');
      const cardNameControl = this.checkoutForm.get('cardName');

      if (method === 'card') {
        cardNumberControl?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]); // 16 dígitos
        cardExpiryControl?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?(\d{2})$/)]); // MM/AA
        cardCvvControl?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]); // 3 o 4 dígitos
        cardNameControl?.setValidators([Validators.required]);
      } else {
        // Limpiar validadores y valores si no es pago con tarjeta
        cardNumberControl?.clearValidators();
        cardExpiryControl?.clearValidators();
        cardCvvControl?.clearValidators();
        cardNameControl?.clearValidators();

        cardNumberControl?.setValue('');
        cardExpiryControl?.setValue('');
        cardCvvControl?.setValue('');
        cardNameControl?.setValue('');
      }
      // Actualizar la validez para que se apliquen los nuevos validadores
      cardNumberControl?.updateValueAndValidity();
      cardExpiryControl?.updateValueAndValidity();
      cardCvvControl?.updateValueAndValidity();
      cardNameControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.cartSubscription = this.cartService.cartState$.subscribe(state => {
      this.cartState = state;
      this.calculateOrderSummary();
    });

    // Redirigir si el carrito está vacío al cargar la página
    if (this.cartService.currentCartState.items.length === 0) {
      this.router.navigate(['/menu']); // O a la ruta de menú principal
    }
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private calculateOrderSummary(): void {
    this.subtotal = this.cartState.total;
    this.tax = this.subtotal * 0.1;
    this.total = this.subtotal + this.tax + this.deliveryFee;
  }

  // Función para manejar el envío del pedido
  async handlePlaceOrder(): Promise<void> {
    this.checkoutForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores

    if (this.checkoutForm.valid) {
      this.isProcessing = true;
      console.log('Pedido válido:', this.checkoutForm.value);

      // Simular procesamiento del pedido (ej. llamada a API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.cartService.clearCart();
      this.router.navigate(['/order-confirmation']); // Redirigir a confirmación
    } else {
      console.error('El formulario no es válido. Por favor, revisa los campos.');
      // Opcional: Desplazarse al primer campo inválido
    }
  }

  // Función auxiliar para verificar si un campo es inválido y ha sido tocado
  confirmarCampo(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // Función para manejar el cambio en el RadioGroup (paymentMethod)
  onPaymentMethodChange(value: string): void {
    this.checkoutForm.get('paymentMethod')?.setValue(value);
  }
}