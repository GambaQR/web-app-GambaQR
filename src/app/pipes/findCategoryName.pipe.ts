import { Pipe, PipeTransform } from '@angular/core';
import { MenuCategory } from '../restaurant-panel/restaurant-panel.component';

@Pipe({
  name: 'findCategoryName'
})
export class FindCategoryNamePipe implements PipeTransform {
  transform(categories: MenuCategory[], categoryId: string): string | undefined {
    return categories.find(c => c.id === Number(categoryId))?.name;
  }
}