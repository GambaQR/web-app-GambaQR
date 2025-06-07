// src/app/restaurant-panel/restaurant-panel.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductResponse, ProductRequest, ProductService } from '../services/product.service'; // Importar ProductRequest
// Importar los nuevos componentes
import { CategoryManagerComponent } from '../restaurant/category-manager/category-manager.component';
import { ProductManagerComponent } from '../restaurant/product-manager/product-manager.component';
import { CategoryFormComponent } from '../restaurant/category-form/category-form.component';
import { ProductFormComponent } from '../restaurant/product-form/product-form.component';
import { CategoryResponse, CategoryService } from '../services/category.service';

// Interfaces
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
    ProductFormComponent
  ],
  templateUrl: './restaurant-panel.component.html',
})
export class RestaurantPanelComponent implements OnInit {
  orders: Order[] = [];

  todayStats = {
    totalOrders: 45,
    revenue: 1250.50,
    avgOrderValue: 27.79,
    activeCustomers: 12,
  };

  activeTab: 'dashboard' | 'orders' | 'menu' | 'analytics' = 'dashboard';

  menuCategories: MenuCategory[] = [];
  menuProducts: MenuProduct[] = [];
  showCategoryForm: boolean = false;
  showProductForm: boolean = false;
  editingCategory: MenuCategory | null = null;
  editingProduct: MenuProduct | null = null;

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (products: ProductResponse[]) => {
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
      (error) => {
        console.error('Error obteniendo productos:', error);
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories: CategoryResponse[]) => {
        this.menuCategories = categories.map(category => ({
          ...category
        }));
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
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
    this.productService.createProduct(productData, imageFile).subscribe(
      (response) => {
        console.log('Producto creado exitosamente:', response);
        this.showProductForm = false; // *** CERRAR EL FORMULARIO ***
        this.loadProducts(); // *** ACTUALIZAR LA LISTA DE PRODUCTOS ***
      },
      (error) => {
        console.error('Error creando el producto:', error);
      }
    );
  }

  onProductFormCancel(): void {
    this.showProductForm = false;
    this.editingProduct = null;
  }

  // --- Métodos de pestañas ---
  setActiveTab(tab: 'dashboard' | 'orders' | 'menu' | 'analytics'): void {
    this.activeTab = tab;
  }

  // --- Métodos de categorías ---
  handleAddCategory(): void {
    this.editingCategory = null;
    this.showCategoryForm = true;
  }

  handleEditCategory(category: MenuCategory): void {
    this.editingCategory = category;
    this.showCategoryForm = true;
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
        id: newId
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
}