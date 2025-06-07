import { Pipe, PipeTransform } from '@angular/core';
import { MenuCategory } from '../restaurant-panel/restaurant-panel.component';

@Pipe({
  name: 'filterActiveCategories',
  standalone: true // Importante si usas componentes standalone
})
export class FilterActiveCategoriesPipe implements PipeTransform {
  transform(categories: MenuCategory[] | null): MenuCategory[] {
    if (!categories) {
      return [];
    }
    return categories.filter(category => category.isActive);
  }
}