import { Component } from '@angular/core';
import { MenuCardComponent } from "./menu-card/menu-card.component";
import { CommonModule } from '@angular/common';
import { FindCategoryNamePipe } from "../pipes/findCategoryName.pipe";
import { FilterByCategoryPipe } from "../pipes/filterByCategory.pipe";

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  description: string;
  category: string;
}

@Component({
  selector: 'app-menu',
  imports: [MenuCardComponent, CommonModule, FindCategoryNamePipe, FilterByCategoryPipe],
  templateUrl: './menu.component.html',
})
export class MenuComponent {

  // Propiedad para la categoría activa
  activeCategory: string = 'all';

  // Datos de ejemplo para las categorías
  categories: Category[] = [
    { id: 'all', name: 'Todos', icon: '📦' }, // Podrías usar un icono SVG o una clase de FontAwesome aquí
    { id: 'combos', name: 'Combos', icon: '🍟' },
    { id: 'burgers', name: 'Hamburguesas', icon: '🍔' },
    { id: 'drinks', name: 'Bebidas', icon: '🥤' },
    // Añade más categorías si las tienes
  ];

  // Datos de ejemplo para tus productos (combos, hamburguesas, bebidas)
  // **Importante:** Cada producto debe tener una propiedad 'category'
  allProducts: Product[] = []; // Aquí se fusionarán todos tus productos
  filteredProducts: Product[] = [];

  // Datos de tus combos (manténlos si los usas por separado para algo más)
  combos: Product[] = [
    { id: 'c1', image: 'combo.jpg', title: 'Combo Clásico', price: 10.99, description: 'Hamburguesa, patatas y bebida.', category: 'combos' },
    { id: 'c2', image: 'combo-familiar.jpg', title: 'Combo Familiar', price: 29.99, description: 'Dos hamburguesas, patatas grandes y dos bebidas.', category: 'combos' },
    // ... más combos
  ];

  // Datos de tus hamburguesas
  burgers: Product[] = [
    { id: 'b1', image: 'example.png', title: 'Hamburguesa Original', price: 8.50, description: 'Nuestra clásica con queso cheddar.', category: 'burgers' },
    { id: 'b2', image: 'burguer-gambas.jpg', title: 'Hamburguesa Gamba', price: 9.75, description: 'Con gambas al ajillo y salsa especial.', category: 'burgers' },
    // ... más hamburguesas
  ];

  // Datos de tus bebidas
  drinks: Product[] = [
    { id: 'd1', image: 'soda.jpg', title: 'Refresco Cola', price: 2.50, description: 'Coca-Cola 330ml.', category: 'drinks' },
    { id: 'd2', image: 'water.jpg', title: 'Agua Mineral', price: 1.50, description: 'Botella de 500ml.', category: 'drinks' },
    // ... más bebidas
  ];

  ngOnInit(): void {
    // Combina todos los productos en una única lista
    this.allProducts = [...this.combos, ...this.burgers, ...this.drinks];
    this.filterProducts(); // Llama a la función para filtrar al inicio
  }

  // Función para filtrar los productos según la categoría activa
  filterProducts(): void {
    if (this.activeCategory === 'all') {
      this.filteredProducts = this.allProducts;
    } else {
      this.filteredProducts = this.allProducts.filter(
        (p) => p.category === this.activeCategory
      );
    }
  }

  // Función para cambiar la categoría activa y volver a filtrar
  setActiveCategory(categoryId: string): void {
    this.activeCategory = categoryId;
    this.filterProducts();
  }

  addToCart(): void {
    console.log('Producto añadido al carrito!');
    // Aquí puedes implementar la lógica para añadir al carrito
  }

}
