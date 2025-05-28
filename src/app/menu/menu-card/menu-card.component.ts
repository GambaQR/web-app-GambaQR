import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common'; // Importar NgIf y NgClass

import { Product } from '../menu.component'; // Importar la interfaz Product desde el componente Menu

@Component({
  selector: 'menu-card',
  standalone: true,
  imports: [CommonModule, NgIf], // Asegúrate de importar NgIf y NgClass
  templateUrl: './menu-card.component.html',
})
export class MenuCardComponent {
  @Input() product!: Product; // Ahora recibe el objeto producto completo
  @Input() quantityInCart: number = 0; // La cantidad actual de este producto en el carrito

  // Eventos de salida más específicos
  @Output() addFirstItem = new EventEmitter<Product>();
  @Output() updateItemQuantity = new EventEmitter<{ itemId: number, newQuantity: number }>();

  // Nuevo getter para el precio formateado (ej. $12.99)
  get formattedPrice(): string {
    return `$${this.product.price.toFixed(2)}`;
  }

  onAddFirstItem(): void {
    this.addFirstItem.emit(this.product);
  }

  onIncreaseQuantity(): void {
    this.updateItemQuantity.emit({ itemId: this.product.id, newQuantity: this.quantityInCart + 1 });
  }

  onDecreaseQuantity(): void {
    this.updateItemQuantity.emit({ itemId: this.product.id, newQuantity: this.quantityInCart - 1 });
  }
}