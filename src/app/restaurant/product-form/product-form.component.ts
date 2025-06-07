import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MenuCategory, MenuProduct } from '../../restaurant-panel/restaurant-panel.component';
import { ProductRequest } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit, OnChanges { // Implement OnChanges
  @Input() product: MenuProduct | null = null;
  @Input() categories: MenuCategory[] = [];

  @Output() onSave = new EventEmitter<{ productData: ProductRequest, imageFile: File | null }>();
  @Output() onCancel = new EventEmitter<void>();

  productForm!: FormGroup;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  constructor(
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // Initial form setup (will be overridden by ngOnChanges if 'product' is present)
    this.initForm();
  }

  // Use ngOnChanges to react to changes in the @Input() product
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue !== changes['product'].previousValue) {
      this.initForm(); // Re-initialize the form when the product input changes
      if (this.product?.image) {
        this.imagePreviewUrl = this.product.image;
      } else {
        this.imagePreviewUrl = null;
      }
    }
  }

  private initForm(): void {
    // Reset selectedImageFile and imagePreviewUrl when initializing the form
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;

    this.productForm = this.fb.group({
      name: [this.product?.name ?? '', Validators.required],
      description: [this.product?.description ?? '', Validators.required],
      price: [this.product?.price ?? 0, [Validators.required, Validators.min(0.01)]],
      categoryId: [this.product?.categoryId ?? '', Validators.required],
    });
  }

  handleSubmit(): void {
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      const productData = { ...this.productForm.value };

      const requestData: ProductRequest = {
        categoryId: productData.categoryId,
        restaurantId: 1, // Assuming a fixed restaurantId for now
        name: productData.name,
        description: productData.description,
        price: productData.price,
        tax: 0,
        currency: 'EUR',
      };

      this.onSave.emit({ productData: requestData, imageFile: this.selectedImageFile });

    } else {
      console.error('Formulario inválido.');
    }
  }

  confirmarCampo(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImageFile = null;
      this.imagePreviewUrl = null;
    }
  }

  // No need for onPriceChange if you're using formControlName
  // onPriceChange(event: Event): void {
  //   const price = parseFloat((event.target as HTMLInputElement).value);
  //   this.productForm.get('price')?.setValue(price || 0);
  // }
}