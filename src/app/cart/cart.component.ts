import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common'; // Importar NgClass, NgIf, NgFor
import { RouterLink } from '@angular/router'; // Para Link de Next.js
import { CartService, CartState } from '../services/cart.service'; // Ajusta la ruta a tu servicio
import { Subscription } from 'rxjs'; // Para manejar las suscripciones y evitar fugas de memoria

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf, NgFor], // Añadir las directivas de Angular
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {
  cartState!: CartState; // Usamos '!' porque se inicializa en ngOnInit
  private cartSubscription!: Subscription; // Para desuscribirse cuando el componente se destruye

  // Estado local para la edición de notas
  editingNotes: number | null = null;
  tempNotes: string = '';

  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;

  constructor(private readonly cartService: CartService) {}

  ngOnInit() {
    // Suscribirse a los cambios del estado del carrito
    this.cartSubscription = this.cartService.cartState$.subscribe(state => {
      this.cartState = state;
      this.calculateTotals();
    });
  }

  ngOnDestroy() {
    // Desuscribirse para evitar fugas de memoria
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private calculateTotals() {
    this.subtotal = this.cartState.total;
    this.tax = this.subtotal * 0.1;
    this.total = this.subtotal + this.tax;
  }

  handleUpdateQuantity(itemId: number, newQuantity: number): void {
    this.cartService.updateQuantity(itemId, newQuantity);
  }

  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  handleEditNotes(itemId: number, currentNotes: string | undefined = ''): void {
    this.editingNotes = itemId;
    this.tempNotes = currentNotes;
  }

  onNotesChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    // Asigna el valor del textarea a tempNotes. Si es null/undefined, asigna una cadena vacía.
    this.tempNotes = textarea?.value || ''; // Usa || '' para asegurar que siempre sea string
  }

  handleSaveNotes(itemId: number): void {
    this.cartService.updateNotes(itemId, this.tempNotes);
    this.editingNotes = null;
    this.tempNotes = '';
  }

  handleCancelEdit(): void {
    this.editingNotes = null;
    this.tempNotes = '';
  }
}
