import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../menu/menu.component';

@Pipe({
  name: 'filterByCategory'
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(products: Product[], categoryId: string): Product[] {
    return products.filter(product => product.category === categoryId);
  }
}