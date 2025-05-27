import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../menu/menu.component';

@Pipe({
  name: 'findCategoryName'
})
export class FindCategoryNamePipe implements PipeTransform {
  transform(categories: Category[], categoryId: string): string | undefined {
    return categories.find(c => c.id === categoryId)?.name;
  }
}