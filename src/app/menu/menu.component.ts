import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass, NgIf, NgFor } from '@angular/common';
import { MenuCardComponent } from "./menu-card/menu-card.component";
import { FilterByCategoryPipe } from "../pipes/filterByCategory.pipe";
import { CartService, CartState, CartItem } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { RouterLink, ActivatedRoute } from '@angular/router'; 

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

  // Datos de menú combinados directamente en el componente para Angular
  allProducts: Product[] = [
    {
      id: 1,
      name: "Ensalada Mediterránea",
      description: "Fresca ensalada con tomates, aceitunas, queso feta y aderezo de hierbas",
      price: 12.99,
      category: "ensaladas", // Usar minúsculas para consistencia con los IDs de categoría
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Imágenes de ejemplo
    },
    {
      id: 2,
      name: "Hamburguesa Clásica",
      description: "Carne de res, lechuga, tomate, cebolla y papas fritas",
      price: 15.99,
      category: "principales",
      image: "https://images.unsplash.com/photo-1571091718767-f87c9bc451b6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      name: "Pasta Carbonara",
      description: "Pasta con salsa cremosa, panceta y queso parmesano",
      price: 14.99,
      category: "principales",
      image: "https://images.unsplash.com/photo-1621995874288-7511c521074e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      name: "Smoothie de Frutas",
      description: "Mezcla de frutas tropicales con yogurt natural",
      price: 6.99,
      category: "bebidas",
      image: "https://images.unsplash.com/photo-1505252585461-a11333afbd3d?q=80&w=1853&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      name: "Pizza Margherita",
      description: "Pizza clásica con tomate, mozzarella y albahaca fresca",
      price: 18.99,
      category: "principales",
      image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a47?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 6,
      name: "Sopa de Tomate",
      description: "Cremosa sopa de tomate con hierbas aromáticas",
      price: 8.99,
      category: "sopas",
      image: "https://images.unsplash.com/photo-1543719003-9e4a3a6c221a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  filteredProducts: Product[] = [];
  cartState!: CartState;
  private cartSubscription!: Subscription;
  private routeSubscription!: Subscription; // ¡Nueva suscripción para los parámetros de ruta!

  constructor(
    private readonly cartService: CartService,
    private readonly route: ActivatedRoute // ¡Inyectar ActivatedRoute!
  ) {}

  ngOnInit(): void {
    // Al inicio, se muestran todos los productos
    this.filterProducts();

    // Suscribirse a los cambios del carrito
    this.cartSubscription = this.cartService.cartState$.subscribe(state => {
      this.cartState = state;
    });

    // ¡Suscribirse a los queryParams para obtener el número de mesa!
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      if (params['table']) {
        this.tableNumber = params['table'];
        // Opcional: Podrías guardar esto en un servicio o localStorage
        // si necesitas persistirlo a través de recargas o navegar fuera y volver.
      } else {
        this.tableNumber = 'N/A'; // O un valor por defecto si no hay mesa
      }
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