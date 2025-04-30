import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'menu-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-card p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 space-y-3">
      <img
        [src]="image"
        [alt]="title"
        class="rounded-lg w-full h-40 object-cover"
      />

      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ title }}
        </h3>
        <span class="price-text text-lg font-bold text-primary">
          {{ price | currency:'EUR' }}
        </span>
      </div>

      <p class="text-md text-gray-600 dark:text-gray-300">
        {{ description }}
      </p>

      <div class="flex justify-end">
        <button class="form-button px-4 py-2 text-sm" (click)="addToCart()">
          <i class="bi bi-cart-plus mr-1"></i> Añadir al carrito
        </button>
      </div>
    </div>
  `,
})
export class MenuCardComponent {
  @Input() image: string = 'empty.webp';
  @Input() title: string = 'Producto';
  @Input() price: number = 0.0;
  @Input() description: string = 'Descripción del producto';

  @Output() onAddToCart = new EventEmitter<void>();

  addToCart() {
    this.onAddToCart.emit();
  }
}
