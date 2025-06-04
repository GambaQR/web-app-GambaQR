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

  products: ProductResponse[] = []; // Almacena todos los productos
  filteredProducts: ProductResponse[] = []; // Para mostrar en la vista
  //activeCategory: string = 'all'; // Categoría activa (por defecto "all")

  cartState!: CartState;
  private cartSubscription!: Subscription;
  private routeSubscription!: Subscription; // ¡Nueva suscripción para los parámetros de ruta!

  constructor(
    private readonly cartService: CartService,
    private readonly route: ActivatedRoute, // ¡Inyectar ActivatedRoute!
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadProducts();

    this.cartSubscription = this.cartService.cartState$.subscribe(state => {
      this.cartState = state;
    });

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.tableNumber = params['table'] || 'N/A';
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data; // Inicialmente muestra todos los productos
      },
      error: (err) => console.error('Error cargando productos:', err)
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


  setActiveCategory(categoryId: string): void {
    this.activeCategory = categoryId;
    this.filteredProducts = categoryId === 'all'
      ? this.products
      : this.products.filter(product => product.category.id === categoryId);
  }


  // --- Métodos de interacción con el carrito ---

  handleAddToCart(item: ProductResponse): void {
    // Convertir Product a CartItem
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1, // Añadir 1 por defecto
      image: item.imageUrl
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