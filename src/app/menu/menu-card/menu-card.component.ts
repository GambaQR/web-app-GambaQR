import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'menu-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-card.component.html',
})
export class MenuCardComponent {
  @Input() image: string = 'placeholder.webp';
  @Input() title: string = 'Producto';
  @Input() price: number = 0.0;
  @Input() description: string = 'Descripción del producto';

  @Output() onAddToCart = new EventEmitter<void>();

  addToCart() {
    this.onAddToCart.emit();
  }
}
