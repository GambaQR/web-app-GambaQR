import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MenuCategory, MenuProduct } from '../../restaurant-panel/restaurant-panel.component';
import { FilterActiveCategoriesPipe } from "../../pipes/filter-active-categories.pipe";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass, ReactiveFormsModule, FormsModule, FilterActiveCategoriesPipe],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  @Input() product: MenuProduct | null = null; // Si se pasa un producto, es para editar
  @Input() categories: MenuCategory[] = []; // Necesita las categorías para el select

  @Output() onSave = new EventEmitter<Omit<MenuProduct, 'id' | 'createdAt' | 'categoryName'>>();
  @Output() onCancel = new EventEmitter<void>();

  productForm!: FormGroup;
  newIngredient: string = '';
  newAllergen: string = '';

  constructor(
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [this.product?.name ?? '', Validators.required],
      description: [this.product?.description ?? '', Validators.required],
      price: [this.product?.price ?? 0, [Validators.required, Validators.min(0.01)]],
      categoryId: [this.product?.categoryId ?? '', Validators.required], // Usar '' para el placeholder del select
      image: [this.product?.image ?? ''],
      isActive: [this.product?.isActive ?? true],
      isAvailable: [this.product?.isAvailable ?? true],
      ingredients: [this.product?.ingredients ?? []],
      isPromotion: [this.product?.isPromotion ?? false],
      originalPrice: [this.product?.originalPrice ?? 0],
    });

    // Validadores condicionales para precio original si es promoción
    this.productForm.get('isPromotion')?.valueChanges.subscribe(isPromotion => {
      const originalPriceControl = this.productForm.get('originalPrice');
      if (isPromotion) {
        originalPriceControl?.setValidators([Validators.required, Validators.min((this.productForm.get('price')?.value ?? 0) + 0.01)]);
      } else {
        originalPriceControl?.clearValidators();
        originalPriceControl?.setValue(0);
      }
      originalPriceControl?.updateValueAndValidity();
    });

    // Actualizar validador de originalPrice si cambia el precio del producto
    this.productForm.get('price')?.valueChanges.subscribe(price => {
      const originalPriceControl = this.productForm.get('originalPrice');
      if (this.productForm.get('isPromotion')?.value) {
        originalPriceControl?.setValidators([Validators.required, Validators.min(price + 0.01)]);
        originalPriceControl?.updateValueAndValidity();
      }
    });
  }

  handleSubmit(): void {
    this.productForm.markAllAsTouched(); // Marcar todos los campos como tocados

    if (this.productForm.valid) {
      // Remover propiedades que no se guardan en el backend
      const productData: Omit<MenuProduct, 'id' | 'createdAt' | 'categoryName'> = {
        ...this.productForm.value
      };
      this.onSave.emit(productData);
    } else {
      console.error('Formulario de producto inválido.');
    }
  }

  confirmarCampo(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  addIngredient(): void {
    if (this.newIngredient.trim() && !this.productForm.get('ingredients')?.value.includes(this.newIngredient.trim())) {
      const currentIngredients = this.productForm.get('ingredients')?.value;
      this.productForm.get('ingredients')?.setValue([...currentIngredients, this.newIngredient.trim()]);
      this.newIngredient = '';
    }
  }

  removeIngredient(ingredient: string): void {
    const currentIngredients = this.productForm.get('ingredients')?.value;
    this.productForm.get('ingredients')?.setValue(currentIngredients.filter((i: string) => i !== ingredient));
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // En una implementación real, aquí subirías la imagen a un servidor
      // y obtendrías la URL. Por ahora, usamos URL.createObjectURL para previsualizar.
      const imageUrl = URL.createObjectURL(file);
      this.productForm.get('image')?.setValue(imageUrl);
    }
  }

  onPriceChange(event: Event): void {
    const price = parseFloat((event.target as HTMLInputElement).value);
    this.productForm.get('price')?.setValue(price || 0); // Asegurar que sea número
  }

  onOriginalPriceChange(event: Event): void {
    const originalPrice = parseFloat((event.target as HTMLInputElement).value);
    this.productForm.get('originalPrice')?.setValue(originalPrice || 0);
  }
}