import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Importar los nuevos componentes
import { CategoryManagerComponent } from '../restaurant/category-manager/category-manager.component';
import { ProductManagerComponent } from '../restaurant/product-manager/product-manager.component';
import { CategoryFormComponent } from '../restaurant/category-form/category-form.component';
import { ProductFormComponent } from '../restaurant/product-form/product-form.component';

// Interfaces (mantenidas de tu código original, eliminando isVeg si se había quitado antes)
interface Order {
  id: string;
  table: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  time: string;
  customer: string;
}

export interface MenuCategory { // Exportar para que otros componentes puedan usarla
  id: number;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface MenuProduct { // Exportar para que otros componentes puedan usarla
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  image: string;
  // isVeg: boolean; // Asegúrate de que esta propiedad esté eliminada si no la necesitas
  isActive: boolean;
  isAvailable: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  calories?: number;
  isPromotion: boolean;
  originalPrice?: number;
  createdAt: string;
}

@Component({
  selector: 'app-restaurant-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgIf,
    NgFor,
    NgClass,
    CategoryManagerComponent, // Importar CategoryManagerComponent
    ProductManagerComponent,  // Importar ProductManagerComponent
    CategoryFormComponent,    // Importar CategoryFormComponent
    ProductFormComponent      // Importar ProductFormComponent
  ],
  templateUrl: './restaurant-panel.component.html',
})
export class RestaurantPanelComponent {
  orders: Order[] = [
    { id: "ORD-001", table: "Mesa 4", items: ["Hamburguesa Clásica x2", "Smoothie de Frutas x1"], total: 38.97, status: "pending", time: "14:30", customer: "Juan Pérez" },
    { id: "ORD-002", table: "Mesa 7", items: ["Ensalada Mediterránea x1", "Pasta Carbonara x1"], total: 27.98, status: "preparing", time: "14:25", customer: "María García" },
    { id: "ORD-003", table: "Mesa 2", items: ["Hamburguesa Clásica x1", "Ensalada Mediterránea x1"], total: 28.98, status: "ready", time: "14:20", customer: "Carlos López" },
    { id: "ORD-004", table: "Mesa 1", items: ["Pizza Margherita x1"], total: 18.99, status: "pending", time: "14:40", customer: "Ana Torres" },
    { id: "ORD-005", table: "Mesa 10", items: ["Sopa de Tomate x1", "Smoothie de Frutas x1"], total: 15.98, status: "delivered", time: "14:10", customer: "Pedro Ruiz" },
  ];

  todayStats = {
    totalOrders: 45,
    revenue: 1250.50,
    avgOrderValue: 27.79,
    activeCustomers: 12,
  };

  activeTab: 'dashboard' | 'orders' | 'menu' | 'analytics' = 'dashboard';

  menuCategories: MenuCategory[] = [
    { id: 1, name: "Entradas", description: "Aperitivos y entradas para comenzar", icon: "🥗", isActive: true, order: 1, createdAt: "2024-01-15" },
    { id: 2, name: "Platos Principales", description: "Nuestros platos principales más populares", icon: "🍽️", isActive: true, order: 2, createdAt: "2024-01-15" },
    { id: 3, name: "Bebidas", description: "Refrescos, jugos y bebidas calientes", icon: "🥤", isActive: true, order: 3, createdAt: "2024-01-15" },
    { id: 4, name: "Combos", description: "Combinaciones especiales con descuento", icon: "🍔", isActive: true, order: 4, createdAt: "2024-01-15" },
    { id: 5, name: "Promociones del Día", description: "Ofertas especiales y promociones limitadas", icon: "⭐", isActive: true, order: 5, createdAt: "2024-01-15" },
  ];

  menuProducts: MenuProduct[] = [
    { id: 1, name: "Ensalada Mediterránea", description: "Fresca ensalada con tomates, aceitunas, queso feta y aderezo de hierbas", price: 12.99, categoryId: 1, categoryName: "Entradas", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", isActive: true, isAvailable: true, preparationTime: 10, ingredients: ["Lechuga", "Tomate", "Aceitunas", "Queso Feta", "Aderezo"], allergens: ["Lácteos"], calories: 250, isPromotion: false, originalPrice: 0, createdAt: "2024-01-15" },
    { id: 2, name: "Hamburguesa Clásica", description: "Carne de res, lechuga, tomate, cebolla y papas fritas", price: 15.99, categoryId: 2, categoryName: "Platos Principales", image: "https://images.unsplash.com/photo-1571091718767-f87c9bc451b6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", isActive: true, isAvailable: true, preparationTime: 15, ingredients: ["Carne de res", "Pan", "Lechuga", "Tomate", "Cebolla", "Papas"], allergens: ["Gluten"], calories: 650, isPromotion: true, originalPrice: 18.99, createdAt: "2024-01-15" },
    { id: 3, name: "Smoothie de Frutas", description: "Mezcla de frutas tropicales con yogurt natural", price: 6.99, categoryId: 3, categoryName: "Bebidas", image: "https://images.unsplash.com/photo-1505252585461-a11333afbd3d?q=80&w=1853&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", isActive: true, isAvailable: true, preparationTime: 5, ingredients: ["Mango", "Piña", "Plátano", "Yogurt", "Miel"], allergens: ["Lácteos"], calories: 180, isPromotion: false, originalPrice: 0, createdAt: "2024-01-15" },
  ];

  showCategoryForm: boolean = false;
  showProductForm: boolean = false;
  editingCategory: MenuCategory | null = null;
  editingProduct: MenuProduct | null = null;

  constructor() { }

  updateOrderStatus(orderId: string, newStatus: Order['status']): void {
    this.orders = this.orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
  }

  getStatusColor(status: Order['status']): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'delivered': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getStatusText(status: Order['status']): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      default: return 'Desconocido';
    }
  }

  // --- Métodos para la gestión de menú (pasados a este componente) ---
  handleAddCategory(): void {
    this.editingCategory = null; // Para indicar que es una nueva categoría
    this.showCategoryForm = true;
  }

  handleEditCategory(category: MenuCategory): void {
    this.editingCategory = category;
    this.showCategoryForm = true;
  }

  handleDeleteCategory(categoryId: number): void {
    // Implementar lógica de eliminación
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.menuCategories = this.menuCategories.filter(cat => cat.id !== categoryId);
    }
  }

  handleToggleCategoryStatus(categoryId: number): void {
    this.menuCategories = this.menuCategories.map(cat =>
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    );
  }

  onCategoryFormSave(categoryData: Omit<MenuCategory, 'id' | 'createdAt'>): void {
    if (this.editingCategory) {
      // Editar categoría existente
      this.menuCategories = this.menuCategories.map(cat =>
        cat.id === this.editingCategory?.id ? { ...cat, ...categoryData } : cat
      );
    } else {
      // Crear nueva categoría
      const newId = Math.max(...this.menuCategories.map(cat => cat.id), 0) + 1;
      const newCategory: MenuCategory = {
        ...categoryData,
        id: newId,
        createdAt: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
      };
      this.menuCategories = [...this.menuCategories, newCategory];
    }
    this.showCategoryForm = false; // Cerrar modal
    this.editingCategory = null; // Resetear
  }

  onCategoryFormCancel(): void {
    this.showCategoryForm = false; // Cerrar modal
    this.editingCategory = null; // Resetear
  }

  handleAddProduct(): void {
    this.editingProduct = null; // Para indicar que es un nuevo producto
    this.showProductForm = true;
  }

  handleEditProduct(product: MenuProduct): void {
    this.editingProduct = product;
    this.showProductForm = true;
  }

  handleDeleteProduct(productId: number): void {
    // Implementar lógica de eliminación
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.menuProducts = this.menuProducts.filter(prod => prod.id !== productId);
    }
  }

  handleToggleProductStatus(productId: number): void {
    this.menuProducts = this.menuProducts.map(prod =>
      prod.id === productId ? { ...prod, isActive: !prod.isActive } : prod
    );
  }

  handleToggleProductAvailability(productId: number): void {
    this.menuProducts = this.menuProducts.map(prod =>
      prod.id === productId ? { ...prod, isAvailable: !prod.isAvailable } : prod
    );
  }

  onProductFormSave(productData: Omit<MenuProduct, 'id' | 'createdAt' | 'categoryName'>): void {
    // Encontrar el nombre de la categoría para asignarlo
    const category = this.menuCategories.find(cat => cat.id === productData.categoryId);
    const categoryName = category ? category.name : 'Desconocida';

    if (this.editingProduct) {
      // Editar producto existente
      this.menuProducts = this.menuProducts.map(prod =>
        prod.id === this.editingProduct?.id ? { ...prod, ...productData, categoryName: categoryName } : prod
      );
    } else {
      // Crear nuevo producto
      const newId = Math.max(...this.menuProducts.map(prod => prod.id), 0) + 1;
      const newProduct: MenuProduct = {
        ...productData,
        id: newId,
        categoryName: categoryName,
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.menuProducts = [...this.menuProducts, newProduct];
    }
    this.showProductForm = false; // Cerrar modal
    this.editingProduct = null; // Resetear
  }

  onProductFormCancel(): void {
    this.showProductForm = false; // Cerrar modal
    this.editingProduct = null; // Resetear
  }

  // --- Métodos de pestañas ---
  setActiveTab(tab: 'dashboard' | 'orders' | 'menu' | 'analytics'): void {
    this.activeTab = tab;
  }
}