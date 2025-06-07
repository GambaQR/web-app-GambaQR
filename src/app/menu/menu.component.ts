import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgClass, NgIf, NgFor } from '@angular/common';
import { MenuCardComponent } from "./menu-card/menu-card.component";
import { CartService, CartState, CartItem } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, ProductResponse } from '../services/product.service';
import { CategoryResponse, CategoryService } from '../services/category.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuCardComponent, CommonModule, NgClass, NgIf, NgFor, RouterLink],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, OnDestroy {

  activeCategory: number = 0;
  tableNumber: number = 0;

  categories: CategoryResponse[] = [];
  products: ProductResponse[] = []; // Almacena todos los productos
  filteredProducts: ProductResponse[] = []; // Para mostrar en la vista
  cartState!: CartState;
  private cartSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(
    private readonly cartService: CartService,
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();


    this.cartSubscription = this.cartService.cartState$.subscribe(state => {
      this.cartState = state;
    });

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.tableNumber = params['table'] ?? 0;
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = [{ id: 0, name: 'Todos', description: ''},
        ...data.map(category => ({
          ...category,
        }))
        ];
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data; // Inicialmente muestra todos los productos
        console.log("Productos obtenidos del backend:", this.products);
      },
      error: (err) => console.error('Error cargando productos:', err)
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  setActiveCategory(categoryId: number): void {
    this.activeCategory = categoryId;

    console.log("Categoría activa:", categoryId);
    console.log("Productos filtrados:", this.filteredProducts);

    if (categoryId === 0) {
      this.filteredProducts = this.products; // Mostrar todos los productos
    } else {
      this.filteredProducts = this.products.filter(product => {
        console.log(`Producto: ${product.name}, Categoría ID: ${product.category?.id}`);
        return product.category && product.category.id === categoryId;
      });
    }
    console.log("Productos filtrados:", this.filteredProducts);
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
    console.log("Añadiendo al carrito:", cartItem);
    this.cartService.addItem(cartItem);
  }

  handleUpdateQuantity(itemId: number, newQuantity: number): void {
    console.log(`Actualizando cantidad: ID ${itemId}, Nueva cantidad ${newQuantity}`);
    this.cartService.updateQuantity(itemId, newQuantity);
  }

  getItemQuantity(itemId: number): number {
    return this.cartService.getItemQuantity(itemId);
  }
}