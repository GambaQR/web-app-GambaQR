import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms'; // Importar para Reactive Forms
import { Router, RouterLink } from '@angular/router'; // Para navegación
import { CartService, CartState } from '../services/cart.service'; // Ajusta la ruta a tu servicio
import { Subscription, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { loadStripe, StripeElements, StripeCardElement, Stripe, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentService } from '../services/payment.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIf, NgFor, NgClass], // Asegúrate de importar lo necesario
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  checkoutForm!: FormGroup; // Usaremos FormGroup para manejar los campos
  cartState!: CartState;
  private cartSubscription!: Subscription;

  isProcessing: boolean = false;
  cardComplete: boolean = false;

  // Calculables del resumen del pedido
  subtotal: number = 0;
  tax: number = 0;
  deliveryFee: number = 2.99;
  total: number = 0;

  // Configuración de Stripe
  stripePromise = loadStripe('pk_test_51RTm0rBMZ4jNGuBpQDbmO8w0gquvl2tO1JqtXoQk3MrrsQuy7W3GCAsfETVD69lsZ9S4OGNYsdyJUOlLcC3DiylI004CARHHM7'); // tu clave pública de Stripe
  clientSecret: string | null = null;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '400',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'auto'
  };

  constructor(
    private paymentService: PaymentService,
    private readonly fb: FormBuilder,
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly http: HttpClient,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    // Inicializar el formulario con Reactive Forms
    this.checkoutForm = this.fb.group({
      // Información del Cliente
      customerName: ['', Validators.required],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]], // Teléfono con 9-10 dígitos
      customerEmail: ['', Validators.email], // Email opcional pero validado si se introduce

      // Instrucciones Especiales
      specialInstructions: [''],

      // Información de la Tarjeta
      cardholderName: [''],
      paymentMethod: ['card', Validators.required],
    }, {
      validators: this.paymentMethodValidator.bind(this)
    });
  }

  paymentMethodValidator(formGroup: FormGroup): ValidationErrors | null {
    const method = formGroup.get('paymentMethod')?.value;
    const cardholderName = formGroup.get('cardholderName');

    if (method === 'card') {
      // Requerir nombre del titular
      cardholderName?.setValidators([Validators.required]);

      // Validar Stripe
      if (!this.cardComplete) {
        return { stripeCardIncomplete: true };
      }
    } else {
      cardholderName?.clearValidators();
    }

    cardholderName?.updateValueAndValidity();
    return null;
  }



  async ngAfterViewInit() {

    this.stripe = await this.stripePromise;
    if (!this.stripe) {
      console.error('Stripe no pudo inicializarse');
      return;
    }

    this.elements = this.stripe.elements();
    const style = {
      base: {
        color: 'white',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: 'gray',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    this.cardElement = this.elements.create('card', { style });

    if (this.checkoutForm.get('paymentMethod')?.value === 'card') {
      this.mountCardElement();
    }

    // Escuchar cambios en paymentMethod para montar o desmontar el cardElement
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      if (method === 'card') {
        this.mountCardElement();
      } else {
        this.cardElement?.unmount();
        this.cardComplete = false;
        this.checkoutForm.get('cardholderName')?.clearValidators();
        this.checkoutForm.get('cardholderName')?.updateValueAndValidity();
      }
      this.cd.detectChanges();
    });
  }


  //Listener Cambio de estado
  mountCardElement() {
    setTimeout(() => {
      if (document.getElementById('card-element')) {
        this.cardElement?.mount('#card-element');
        this.cardElement!.on('change', (event) => {
          this.ngZone.run(() => {
            this.cardComplete = event.complete;
            this.checkoutForm.updateValueAndValidity();
            this.cd.detectChanges();
          });
        });
      }
    }, 0);

  }

  ngOnInit() {

    // Redirigir si el carrito está vacío al cargar la página
    if (this.cartService.currentCartState.items.length === 0) {
      this.router.navigate(['/menu']); // O a la ruta de menú principal
    }

    this.cartSubscription = this.cartService.cartState$.subscribe(state => {
      this.cartState = state;
      this.calculateOrderSummary();
    });

  }

  ngOnDestroy() {
    //this.cardElement?.unmount();
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private calculateOrderSummary(): void {
    this.subtotal = this.cartState.total;
    this.tax = this.subtotal * 0.1;
    this.total = this.subtotal + this.tax + this.deliveryFee;
  }

  // Función para manejar el pago del pedido
  async handlePlaceOrder(): Promise<void> {
    if (!this.cardElement) {
      console.error('El elemento de tarjeta no está inicializado');
      return;
    }

    if (this.checkoutForm.valid) {
      this.isProcessing = true;

      const amountInCents = Math.round(this.total * 100); // Stripe usa centavos
      const currency = 'eur';

      try {
        // 1. Crear PaymentIntent
        const clientSecret = await firstValueFrom(
          this.paymentService.createPaymentIntent(amountInCents, currency)
        );

        this.clientSecret = clientSecret;

        const stripe = await this.stripePromise;
        if (!stripe || !this.clientSecret) {
          throw new Error('Stripe no se inicializó correctamente.');
        }

        // 2. Confirmar pago
        const { error, paymentIntent } = await stripe.confirmCardPayment(this.clientSecret, {
          payment_method: {
            card: this.cardElement!,
            billing_details: {
              name: this.checkoutForm.value.cardholderName,
              email: this.checkoutForm.value.customerEmail,
            }
          }
        });

        if (error) {
          console.error('Error en el pago:', error.message);
          return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          console.log('Pago exitoso:', paymentIntent);

          // 3. Guardar el pago en la base de datos
          await firstValueFrom(
            this.paymentService.savePayment({
              amount: amountInCents,
              currency,
              paymentMethod: 'card',
              paymentStatus: paymentIntent.status,
              orderId: this.checkoutForm.value.orderId // debe existir en tu form
            })
          );

          // 4. Finalizar
          this.cartService.clearCart();
          this.router.navigate(['/order-confirmation']);
        }
      } catch (err) {
        console.error('Error al procesar el pago:', err);
      } finally {
        this.isProcessing = false;
      }
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

  isFormValid(): boolean {
    if (this.checkoutForm.get('paymentMethod')?.value === 'card') {
      return this.checkoutForm.valid && this.cardComplete && !this.isProcessing;
    }
    return this.checkoutForm.valid && !this.isProcessing;
  }
}

