import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaz para un ítem del carrito (sin cambios, solo para referencia)
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

// Interfaz para el estado del carrito (sin cambios, solo para referencia)
export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _cartState = new BehaviorSubject<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  cartState$: Observable<CartState> = this._cartState.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();

    // --- AÑADIR CÓDIGO PARA DATOS DE EJEMPLO AQUÍ ---
    // Solo carga datos de ejemplo si el carrito está vacío después de cargar de localStorage
    if (this._cartState.value.items.length === 0) {
      this.addExampleItems();
    }
    // --- FIN DE CÓDIGO PARA DATOS DE EJEMPLO ---
  }

  private loadCartFromLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const storedCart = localStorage.getItem('myAppCart');
      if (storedCart) {
        try { // Añadir try-catch para manejar posibles errores de JSON.parse
          const state = JSON.parse(storedCart);
          // Asegúrate de que los ítems sean un array y que la estructura sea válida
          if (Array.isArray(state.items)) {
            this._cartState.next(state);
          } else {
            console.warn('Datos de carrito en localStorage corruptos. Se inicializa carrito vacío.');
            this.clearCart(); // Limpiar si los datos son inválidos
          }
        } catch (e) {
          console.error('Error al parsear carrito de localStorage:', e);
          this.clearCart(); // Limpiar si hay un error de parseo
        }
      }
    }
  }

  private saveCartToLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('myAppCart', JSON.stringify(this._cartState.value));
    }
  }

  private calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
    let total = 0;
    let itemCount = 0;
    for (const item of items) {
      total += item.price * item.quantity;
      itemCount += item.quantity;
    }
    return { total, itemCount };
  }

  // --- NUEVO MÉTODO PARA AÑADIR EJEMPLOS ---
  private addExampleItems(): void {
    const exampleItems: CartItem[] = [
      {
        id: 101,
        name: 'Hamburguesa Clásica',
        price: 12.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1571091718767-f87c9bc451b6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        notes: 'Sin cebolla, extra pepinillos.'
      },
      {
        id: 102,
        name: 'Ensalada César',
        price: 9.75,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1512852643596-f94d3a86c67d?q=80&w=1853&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        id: 103,
        name: 'Refresco Cola',
        price: 2.00,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1629203851211-1c5c9b7e7c4f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      }
    ];

    const { total, itemCount } = this.calculateCartTotals(exampleItems);
    this._cartState.next({ items: exampleItems, total, itemCount });
    this.saveCartToLocalStorage(); // Guarda los ítems de ejemplo en localStorage
    console.log('Carrito inicializado con ítems de ejemplo para desarrollo.');
  }
  // --- FIN DE NUEVO MÉTODO ---


  // Métodos para interactuar con el carrito (sin cambios)
  addItem(item: CartItem): void {
    const currentItems = [...this._cartState.value.items];
    const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += item.quantity;
    } else {
      currentItems.push({ ...item });
    }
    const { total, itemCount } = this.calculateCartTotals(currentItems);
    this._cartState.next({ items: currentItems, total, itemCount });
    this.saveCartToLocalStorage();
  }

  updateQuantity(itemId: number, newQuantity: number): void {
    const currentItems = [...this._cartState.value.items];
    const itemIndex = currentItems.findIndex((item) => item.id === itemId);

    if (itemIndex > -1) {
      if (newQuantity <= 0) {
        this.removeItem(itemId); // Llama a removeItem si la cantidad es 0 o menos
      } else {
        currentItems[itemIndex].quantity = newQuantity;
        const { total, itemCount } = this.calculateCartTotals(currentItems);
        this._cartState.next({ items: currentItems, total, itemCount });
        this.saveCartToLocalStorage();
      }
    }
  }

  removeItem(itemId: number): void {
    const currentItems = this._cartState.value.items.filter((item) => item.id !== itemId);
    const { total, itemCount } = this.calculateCartTotals(currentItems);
    this._cartState.next({ items: currentItems, total, itemCount });
    this.saveCartToLocalStorage();
  }

  updateNotes(itemId: number, notes: string): void {
    const currentItems = [...this._cartState.value.items];
    const itemIndex = currentItems.findIndex((item) => item.id === itemId);

    if (itemIndex > -1) {
      currentItems[itemIndex].notes = notes;
      const { total, itemCount } = this.calculateCartTotals(currentItems);
      this._cartState.next({ items: currentItems, total, itemCount });
      this.saveCartToLocalStorage();
    }
  }

  getItemQuantity(itemId: number): number {
    const item = this._cartState.value.items.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  }

  clearCart(): void {
    this._cartState.next({ items: [], total: 0, itemCount: 0 });
    this.saveCartToLocalStorage();
  }

  get currentCartState(): CartState {
    return this._cartState.value;
  }
}