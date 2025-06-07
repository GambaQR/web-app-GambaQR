import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

// Importar los nuevos componentes
import { CategoryManagerComponent } from '../restaurant/category-manager/category-manager.component';
import { ProductManagerComponent } from '../restaurant/product-manager/product-manager.component';
import { CategoryFormComponent } from '../restaurant/category-form/category-form.component';
import { ProductFormComponent } from '../restaurant/product-form/product-form.component';
import { OverlayComponent } from "../overlay/overlay.component";
import { ProductRequest, ProductResponse, ProductService } from '../services/product.service';
import { CategoryResponse, CategoryService } from '../services/category.service';

interface Order {
  id: string;
  table: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  time: string;
  customer: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  description: string;
}

export interface MenuProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  image: string;
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
    CategoryManagerComponent,
    ProductManagerComponent,
    CategoryFormComponent,
    ProductFormComponent,
    OverlayComponent
  ],
  templateUrl: './restaurant-panel.component.html',
})
export class RestaurantPanelComponent {
  orders: Order[] = [];

  todayStats = {
    totalOrders: 45,
    revenue: 1250.50,
    avgOrderValue: 27.79,
    activeCustomers: 12,
  };

  // Main tabs
  activeTab: 'dashboard' | 'orders' | 'menu' = 'dashboard';

  // Nested tabs for menu management
  activeMenuTab: 'categories' | 'products' = 'categories'; // Nueva propiedad para las sub-pestañas del menú

  menuCategories: MenuCategory[] = [];

  menuProducts: MenuProduct[] = [];

  showCategoryForm: boolean = false;
  showProductForm: boolean = false;
  editingCategory: MenuCategory | null = null;
  editingProduct: MenuProduct | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products: ProductResponse[]) => {
        this.menuProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.category.id,
          categoryName: product.category.name,
          image: product.imageUrl,
        }));
      },
      error: (error) => {
        console.error('Error obteniendo productos:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: CategoryResponse[]) => {
        this.menuCategories = categories.map(category => ({
          ...category
        }));
      },
      error: (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    });
  }

  // --- Métodos de productos ---
  handleAddProduct(): void {
    this.editingProduct = null;
    this.showProductForm = true;
  }
  

  // *** CAMBIO CLAVE AQUÍ: Recibimos el objeto con productData y imageFile ***
  onProductFormSave(event: { productData: ProductRequest, imageFile: File | null }): void {
    const { productData, imageFile } = event; // Desestructuramos el evento

    // Llamada al servicio para crear el producto con los datos y la imagen real
    this.productService.createProduct(productData, imageFile).subscribe({
      next: (response) => {
        console.log('Producto creado exitosamente:', response);
        this.showProductForm = false; 
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error creando el producto:', error);
      }
    });
  }

  onProductFormCancel(): void {
    this.showProductForm = false;
    this.editingProduct = null;
  }

  // --- Métodos de pestañas ---
  setActiveTab(tab: 'dashboard' | 'orders' | 'menu'): void {
    this.activeTab = tab;
  }

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

  // --- Métodos para la gestión de menú (mantienen su funcionalidad) ---
  handleAddCategory(): void {
    this.editingCategory = null;
    this.showCategoryForm = true;
  }

  handleEditCategory(category: MenuCategory): void {
    this.editingCategory = category;
    this.showCategoryForm = true;
  }

  handleDeleteCategory(categoryId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.menuCategories = this.menuCategories.filter(cat => cat.id !== categoryId);
    }
  }

  onCategoryFormSave(categoryData: Omit<MenuCategory, 'id' | 'createdAt'>): void {
    if (this.editingCategory) {
      this.menuCategories = this.menuCategories.map(cat =>
        cat.id === this.editingCategory?.id ? { ...cat, ...categoryData } : cat
      );
    } else {
      const newId = Math.max(...this.menuCategories.map(cat => cat.id), 0) + 1;
      const newCategory: MenuCategory = {
        ...categoryData,
        id: newId,
      };
      this.menuCategories = [...this.menuCategories, newCategory];
    }
    this.showCategoryForm = false;
    this.editingCategory = null;
  }

  onCategoryFormCancel(): void {
    this.showCategoryForm = false;
    this.editingCategory = null;
  }

  handleEditProduct(product: MenuProduct): void {
    this.editingProduct = product;
    this.showProductForm = true;
  }

  handleProductDelete(productId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log(`Producto con ID ${productId} eliminado exitosamente.`);
          this.loadProducts(); // Recargar la lista de productos para reflejar el cambio
        },
        error: (error) => {
          console.error(`Error al eliminar producto con ID ${productId}:`, error);
          // Puedes mostrar un mensaje de error al usuario aquí
          alert('Error al eliminar el producto. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }

  // --- ACTUALIZADO: Método para las pestañas anidadas de menú ---
  setActiveMenuTab(tab: 'categories' | 'products'): void {
    this.activeMenuTab = tab;
  }
}