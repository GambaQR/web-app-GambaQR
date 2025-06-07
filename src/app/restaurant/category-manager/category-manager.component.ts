import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common'; // DatePipe para formatear fechas
import { MenuCategory } from '../../restaurant-panel/restaurant-panel.component';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './category-manager.component.html',
})
export class CategoryManagerComponent {
  @Input() categories: MenuCategory[] = []; // Recibe la lista de categorías del padre

  // Eventos de salida para comunicar acciones al componente padre
  @Output() onEdit = new EventEmitter<MenuCategory>();
  @Output() onDelete = new EventEmitter<number>(); // Emite el ID de la categoría a eliminar

  // Ordenar categorías por la propiedad 'order'
  get sortedCategories(): MenuCategory[] {
    return [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Métodos que emiten eventos
  editCategory(category: MenuCategory): void {
    this.onEdit.emit(category);
  }

  deleteCategory(categoryId: number): void {
    this.onDelete.emit(categoryId);
  }
}