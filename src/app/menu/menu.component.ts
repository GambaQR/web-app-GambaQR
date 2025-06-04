import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass, NgIf, NgFor } from '@angular/common';
import { MenuCardComponent } from "./menu-card/menu-card.component";
import { FilterByCategoryPipe } from "../pipes/filterByCategory.pipe";
import { CartService, CartState, CartItem } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, ProductResponse } from '../services/product.service';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

@Component({
  selector: 'app-menu',
  standalone: true, // Añadir standalone
  imports: [MenuCardComponent, CommonModule, FilterByCategoryPipe, NgClass, NgIf, NgFor, RouterLink],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  activeCategory: string = 'all';
  tableNumber: string = 'Mesa'; // Inicializar con un valor por defecto o base

  categories: Category[] = [
    { id: 'all', name: 'Todos', icon: '📦' },
    { id: 'ensaladas', name: 'Ensaladas', icon: '🥗' },
    { id: 'principales', name: 'Principales', icon: '🍝' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'sopas', name: 'Sopas', icon: '🍲' },
  ];

  filteredProducts: Product[] = [];
  allProducts: Product[] = [];
  cartState!: CartState;
  private cartSubscription!: Subscription;
  private routeSubscription!: Subscription; // ¡Nueva suscripción para los parámetros de ruta!

  constructor(
    private readonly cartService: CartService,
    private readonly route: ActivatedRoute, // ¡Inyectar ActivatedRoute!
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (productsResponse) => {
        this.allProducts = productsResponse.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.imageUrl, // Convertimos imageUrl a image
          category: p.category.name // Convertimos objeto a string
        }));
        this.filterProducts();
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });

    this.cartSubscription = this.cartService.cartState$.subscribe(state => {
      this.cartState = state;
    });

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.tableNumber = params['table'] || 'N/A';
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.routeSubscription) { // ¡No olvides desuscribirte de los parámetros de ruta!
      this.routeSubscription.unsubscribe();
    }
  }

  filterProducts(): void {
    if (this.activeCategory === 'all') {
      this.filteredProducts = this.allProducts;
    } else {
      // Usar el pipe de filtro si lo tienes, o filtrar directamente
      // Si el pipe `FilterByCategoryPipe` ya hace esto, puedes usarlo.
      // Si no, la lógica de abajo es la que hará el filtrado.
      this.filteredProducts = this.allProducts.filter(
        (p) => p.category === this.activeCategory
      );
    }
  }

  setActiveCategory(categoryId: string): void {
    this.activeCategory = categoryId;
    this.filterProducts();
  }

  // --- Métodos de interacción con el carrito ---

  handleAddToCart(item: Product): void {
    // Convertir Product a CartItem
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1, // Añadir 1 por defecto
      image: item.image
    };
    this.cartService.addItem(cartItem);
  }

  handleUpdateQuantity(itemId: number, newQuantity: number): void {
    this.cartService.updateQuantity(itemId, newQuantity);
  }

  getItemQuantity(itemId: number): number {
    return this.cartService.getItemQuantity(itemId);
  }
}