import { Pipe, PipeTransform } from '@angular/core';
import { ProductResponse as Product } from '../services/product.service';

@Pipe({
  name: 'filterByCategory'
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(products: Product[], categoryId: string): Product[] {
    return products.filter(product => product.category === categoryId);
  }
}