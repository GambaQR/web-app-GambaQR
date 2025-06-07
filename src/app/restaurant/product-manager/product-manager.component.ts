import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common'; // DatePipe para formatear fechas
import { FormsModule } from '@angular/forms'; // Para ngModel en los filtros de búsqueda
import { MenuCategory, MenuProduct } from '../../restaurant-panel/restaurant-panel.component';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule], // Importar FormsModule
  templateUrl: './product-manager.component.html',
})
export class ProductManagerComponent {
  @Input() products: MenuProduct[] = [];
  @Input() categories: MenuCategory[] = [];

  @Output() onEdit = new EventEmitter<MenuProduct>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onToggleStatus = new EventEmitter<number>();
  @Output() onToggleAvailability = new EventEmitter<number>();

  // Estados locales para los filtros
  searchTerm: string = '';
  selectedCategory: string = 'all'; // Usamos string para 'all' y categoryId.toString()
  statusFilter: string = 'all';

  constructor() { }
  get filteredProducts(): MenuProduct[] {
    return this.products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'all' || product.categoryId.toString() === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  // Métodos que emiten eventos
  editProduct(productId: MenuProduct): void {
    this.onEdit.emit(productId);
  }

  deleteProduct(productId: number): void {
    this.onDelete.emit(productId);
  }

  toggleProductStatus(productId: number): void {
    this.onToggleStatus.emit(productId);
  }

  toggleProductAvailability(productId: number): void {
    this.onToggleAvailability.emit(productId);
  }

  // --- Funciones de utilidad para estilos de badges (similar a tu código original) ---
  getBadgeVariant(isActive: boolean, isAvailable?: boolean): string {
    if (isAvailable !== undefined) { // Badge de Disponibilidad
      return isAvailable ? 'bg-green-600 text-white' : 'bg-red-600 text-white';
    }
    // Badge de Activo/Inactivo
    return isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}