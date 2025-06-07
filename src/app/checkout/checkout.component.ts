import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms'; // Importar para Reactive Forms
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // Para navegación
import { CartService, CartState } from '../services/cart.service'; // Ajusta la ruta a tu servicio
import { Subscription, firstValueFrom } from 'rxjs';
import { loadStripe, StripeElements, StripeCardElement, Stripe, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/order.service';
import { QrCodeService } from '../services/qr-code.service';


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
    // Inicializar el formulario con Reactive Forms
    this.checkoutForm = this.fb.group({
      // Información del Cliente
      customerName: ['', Validators.required],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]], // Teléfono con 9-10 dígitos
      customerEmail: ['', Validators.email], // Email opcional pero validado si se introduce

      //Numero de Pedido
      orderId: [''],
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
      // ✅ Solo aplica validadores si no están asignados
      if (!cardholderName?.hasValidator(Validators.required)) {
        cardholderName?.setValidators([Validators.required]);
      }
    } else {
      cardholderName?.clearValidators();
    }

    return method === 'card' && !this.cardComplete ? { stripeCardIncomplete: true } : null;
  }

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
      this.tableNumber = Number(params['table']) || 0;

      console.log("✅ Checkout: Restaurante:", this.restaurantName);
      console.log("✅ Checkout: Mesa:", this.tableNumber);
    });


    // Obtener la clave pública de Stripe directamente desde el servicio
    const publicKey = this.paymentService.getStripePublicKey();
    this.stripe = await loadStripe(publicKey);

    if (this.stripe) {
      this.elements = this.stripe.elements({ locale: 'auto' });

      if (this.checkoutForm.get('paymentMethod')?.value === 'card') {
        this.mountCardElement();
      }
    }
  }


  //Listener Cambio de estado
  mountCardElement(): void {
    const cardElementContainer = document.getElementById('card-element');

    if (!this.elements || !cardElementContainer) {
      console.error("Stripe Elements no está inicializado.");
      return;
    }

    // ✅ Si ya existe una instancia montada, elimínala antes de crear una nueva
    if (this.cardElement) {
      console.log("⚠ Eliminando instancia anterior de tarjeta...");
      this.cardElement.unmount();
      this.cardElement.destroy(); // ✅ Asegura que se elimina completamente
      this.cardElement = null;
    }

    // ✅ Crea un nuevo formulario de tarjeta y lo monta
    console.log("⚡ Creando nueva instancia de tarjeta...");
    this.cardElement = this.elements.create('card', this.cardOptions);
    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event) => {
      this.ngZone.run(() => {
        this.cardComplete = event.complete;
        this.checkoutForm.updateValueAndValidity();
        this.cd.detectChanges();
      });
    });

    console.log("Tarjeta montada correctamente.");
  }



  // Función para manejar el cambio en el RadioGroup (paymentMethod)
  onPaymentMethodChange(value: string): void {
    if (this.checkoutForm.get('paymentMethod')?.value !== value) {
      this.checkoutForm.get('paymentMethod')?.setValue(value, { emitEvent: false });
    }

    setTimeout(() => {
      if (value === 'card') {
        console.log("⚡ Método de pago cambiado a Tarjeta. Montando formulario...");
        this.mountCardElement();
      } else if (this.cardElement) {
        console.log("⚠ Eliminando tarjeta porque se cambió el método de pago...");
        this.cardElement.unmount();
        this.cardElement.destroy();
        this.cardElement = null;
        this.cardComplete = false;
        this.checkoutForm.get('cardholderName')?.clearValidators();
      }
      this.cd.detectChanges();
    }, 100);
  }

  private calculateOrderSummary(): void {
    this.subtotal = this.cartState.total;
    this.tax = this.subtotal * 0.1;
    this.total = this.subtotal + this.tax + this.deliveryFee;
  }

  // Función para manejar el pago del pedido
  async handlePlaceOrder(): Promise<void> {
    if (!this.checkoutForm.valid) {
      console.error("Formulario no válido");
      return;
    }
    this.isProcessing = true;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
    const qrUrl = `${baseUrl}/menu?table=${this.tableNumber}`;

    console.log(" QR URL generada para consulta: ", qrUrl);

    console.log("QR URL generada:", qrUrl);

    const qrCodeResponse = await firstValueFrom(this.qrCodeService.getQrCodeByQrUrl(qrUrl));

    if (!qrCodeResponse || !qrCodeResponse.tableNumber) {
      throw new Error("No se encontró la mesa para el QR.");
    }


    try {
      const qrCodeResponse = await firstValueFrom(this.qrCodeService.getQrCodeByQrUrl(qrUrl));

      if (!qrCodeResponse || !qrCodeResponse.tableNumber) {
        throw new Error("No se encontró la mesa para el QR.");
      }

      const orderData = {
        userId: 1,
        restaurantId: qrCodeResponse.restaurantId,
        tableNumber: qrCodeResponse.tableNumber,
        orderDetails: this.cartState.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const orderResponse = await firstValueFrom(this.orderService.createOrder(orderData));
      if (!orderResponse || !orderResponse.id) {
        throw new Error("Error al crear el pedido.");
      }
      this.checkoutForm.patchValue({ orderId: orderResponse.id });
      const paymentResponse = await firstValueFrom(this.paymentService.createCheckoutSession(orderResponse.id));
      if (!paymentResponse || !paymentResponse.url) {
        throw new Error("Error al generar la sesión de pago.");
      }
      window.location.href = paymentResponse.url;
    } catch (err) {
      console.error("Error en el proceso de pago:", err);
    } finally {
      this.isProcessing = false;
    }
    this.cartService.clearCart();
    this.router.navigate(['/order-confirmation']);
  }

  // Función auxiliar para verificar si un campo es inválido y ha sido tocado
  confirmarCampo(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  isFormValid(): boolean {
    if (this.checkoutForm.get('paymentMethod')?.value === 'card') {
      return this.checkoutForm.valid && this.cardComplete && !this.isProcessing;
    }
    return this.checkoutForm.valid && !this.isProcessing;
  }

  ngOnDestroy() {
    //this.cardElement?.unmount();
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}



