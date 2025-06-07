import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, FormControl, ValidatorFn, AbstractControl } from '@angular/forms'; // Importar para Reactive Forms
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Para navegación
import { CartService, CartState } from '../services/cart.service'; // Ajusta la ruta a tu servicio
import { Subscription, firstValueFrom } from 'rxjs';
import { loadStripe, StripeElements, StripeCardElement, Stripe, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/order.service';
import { QrCodeService } from '../services/qr-code.service';

interface CheckoutForm {
  customerName: FormControl<string>;
  customerPhone: FormControl<string>;
  customerEmail: FormControl<string>;
  orderId: FormControl<string>;
  specialInstructions: FormControl<string>;
  cardholderName: FormControl<string>;
  paymentMethod: FormControl<'card' | 'cash' | 'mobile'>;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgIf, NgFor, NgClass], // Asegúrate de importar lo necesario
  templateUrl: './checkout.component.html',
})


export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup<CheckoutForm>;
  cartState!: CartState;
  private cartSubscription!: Subscription;
  isProcessing: boolean = false;
  cardComplete: boolean = false;
  tableNumber!: number;
  restaurantName!: string;

  // Calculables del resumen del pedido
  subtotal: number = 0;
  tax: number = 0;
  deliveryFee: number = 2.99;
  total: number = 0;

  // Configuración de Stripe
  stripe: Stripe | null = null;
  elements!: StripeElements;
  stripePromise!: Promise<Stripe | null>;
  cardElement: StripeCardElement | null = null;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: 'white',
        color: 'white',
        fontWeight: '20px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
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
    private orderService: OrderService,
    private qrCodeService: QrCodeService,
    private readonly fb: FormBuilder,
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private readonly ngZone: NgZone,
    private route: ActivatedRoute
  ) {
    this.checkoutForm = this.fb.group<CheckoutForm>({
      customerName: this.fb.nonNullable.control('', Validators.required),
      customerPhone: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.pattern(/^\d{9,10}$/)
      ]),
      customerEmail: this.fb.nonNullable.control('', Validators.email),
      orderId: this.fb.nonNullable.control(''),
      specialInstructions: this.fb.nonNullable.control(''),
      cardholderName: this.fb.nonNullable.control(''),
      paymentMethod: this.fb.nonNullable.control<'card' | 'cash' | 'mobile'>('card', Validators.required)
    }, {
      validators: [this.paymentMethodValidator.bind(this)]
    });
  }

  private paymentMethodValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup<CheckoutForm>;
    const method = formGroup.get('paymentMethod')?.value;
    const cardholderName = formGroup.get('cardholderName');

    if (!cardholderName) return null;

    if (method === 'card') {
      if (!cardholderName.hasValidator(Validators.required)) {
        cardholderName.setValidators([Validators.required]);
      }
      return !this.cardComplete ? { stripeCardIncomplete: true } : null;
    } else {
      cardholderName.clearValidators();
      return null;
    }
  };

  async ngOnInit() {

    if (this.cartService.currentCartState.items.length === 0) {
      this.router.navigate(['/menu']);
      return;
    }
    this.cartSubscription = this.cartService.cartState$.subscribe(state => {
      this.cartState = state;
      this.calculateOrderSummary();
    });

    this.route.queryParams.subscribe(params => {
      this.restaurantName = params['restaurant'] || "Desconocido";
      this.tableNumber = Number(params['table']) || 1;
    });

    // Inicializar Stripe
    const publicKey = this.paymentService.getStripePublicKey();
    this.stripe = await loadStripe(publicKey);

    if (this.stripe) {
      this.elements = this.stripe.elements({ locale: 'auto' });

      // Escuchar cambios en el método de pago
      this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
        this.onPaymentMethodChange(method);
      });

      // Montar inicialmente si es necesario
      if (this.checkoutForm.get('paymentMethod')?.value === 'card') {
        this.mountCardElement();
      }
    }
  }
  // Función para manejar el cambio en el RadioGroup (paymentMethod)
  onPaymentMethodChange(value: 'card' | 'cash' | 'mobile'): void {
    const currentMethod = this.checkoutForm.get('paymentMethod')?.value;

    if (currentMethod === value) return;

    this.checkoutForm.patchValue({ paymentMethod: value });
    this.checkoutForm.updateValueAndValidity();

    if (value === 'card') {
      this.mountCardElement();
    } else {
      this.cleanupCardElement();
    }

    this.cd.detectChanges();
  }

  mountCardElement(): void {
    if (!this.elements || this.cardElement) return;

    const cardElementContainer = document.getElementById('card-element');
    if (!cardElementContainer) {
      console.error("Elemento del DOM no encontrado");
      return;
    }

    this.cardElement = this.elements.create('card', this.cardOptions);
    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event) => {
      this.ngZone.run(() => {
        this.cardComplete = event.complete;
        this.checkoutForm.updateValueAndValidity();
        this.cd.detectChanges();
      });
    });
  }

  private cleanupCardElement(): void {
    if (this.cardElement) {
      try {
        this.cardElement.unmount();
        this.cardElement.destroy();
      } catch (e) {
        console.warn("Error al limpiar elemento de tarjeta:", e);
      }
      this.cardElement = null;
      this.cardComplete = false;
      this.checkoutForm.get('cardholderName')?.clearValidators();
      this.checkoutForm.updateValueAndValidity();
    }
  }


  private calculateOrderSummary(): void {
    this.subtotal = this.cartState.total;
    this.tax = this.subtotal * 0.1;
    this.total = this.subtotal + this.tax + this.deliveryFee;
  }

  // Función para manejar el pago del pedido
  async handlePlaceOrder(): Promise<void> {
    if (!this.isFormValid()) return;

    this.isProcessing = true;

    try {
      const baseUrl = window.location.origin;
      const qrUrl = `${baseUrl}/menu?table=${this.tableNumber}`;
      const qrCodeResponse = await firstValueFrom(this.qrCodeService.getQrCodeByQrUrl(qrUrl));

      if (!qrCodeResponse?.tableNumber) {
        throw new Error("No se encontró la mesa para el QR.");
      }

      const orderData = {
        userId: 1,
        restaurantId: qrCodeResponse.restaurantId,
        tableNumber: qrCodeResponse.tableNumber,
        paymentMethod: this.checkoutForm.get('paymentMethod')?.value,
        orderDetails: this.cartState.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const orderResponse = await firstValueFrom(this.orderService.createOrder(orderData));
      if (!orderResponse?.id) {
        throw new Error("Error al crear el pedido.");
      }

      this.checkoutForm.patchValue({ orderId: orderResponse.id.toString() });

      // Manejo diferente según método de pago
      const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;

      if (paymentMethod === 'card') {
        const paymentResponse = await firstValueFrom(
          this.paymentService.createCheckoutSession(orderResponse.id)
        );
        window.location.href = paymentResponse.url;
      } else {
        // Para cash o mobile, redirigir a confirmación
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation']);
      }
    } catch (err) {
      console.error("Error en el proceso de pago:", err);
    } finally {
      this.isProcessing = false;
    }
  }

  // Función auxiliar para verificar si un campo es inválido y ha sido tocado
  confirmarCampo(controlName: string): boolean {
    if (!this.checkoutForm) return false;

    const control = this.checkoutForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  isFormValid(): boolean {
    // Verificación básica del formulario
    if (!this.checkoutForm || this.isProcessing) {
      return false;
    }

    // Obtener controles de forma segura
    const customerName = this.checkoutForm.get('customerName');
    const customerPhone = this.checkoutForm.get('customerPhone');
    const customerEmail = this.checkoutForm.get('customerEmail');
    const paymentMethod = this.checkoutForm.get('paymentMethod');

    // Verificar que todos los controles existan
    if (!customerName || !customerPhone || !customerEmail || !paymentMethod) {
      return false;
    }

    // Validar campos obligatorios
    const basicInfoValid =
      customerName.valid &&
      customerPhone.valid &&
      (customerEmail.valid || customerEmail.value === '');

    // Validación según método de pago
    switch (paymentMethod.value) {
      case 'card':
        const cardholderName = this.checkoutForm.get('cardholderName');
        return basicInfoValid &&
          this.cardComplete &&
          !!cardholderName?.valid;
      case 'mobile':
      case 'cash':
        return basicInfoValid;
      default:
        return false;
    }
  }

  ngOnDestroy() {
    //this.cardElement?.unmount();
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}