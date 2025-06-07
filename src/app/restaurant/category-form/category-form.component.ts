import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Add OnChanges, SimpleChanges
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MenuCategory } from '../../restaurant-panel/restaurant-panel.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit, OnChanges { // Implement OnChanges
  @Input() category: MenuCategory | null = null; // If a category is passed, it's for editing
  @Output() onSave = new EventEmitter<Omit<MenuCategory, 'id' | 'createdAt'>>();
  @Output() onCancel = new EventEmitter<void>();

  categoryForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Initial form setup. Will be re-initialized by ngOnChanges if 'category' input exists.
    this.initForm();
  }

  // Add ngOnChanges to react to changes in the @Input() category
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && changes['category'].currentValue !== changes['category'].previousValue) {
      this.initForm(); // Re-initialize the form when the category input changes
    }
  }

  // Private method to encapsulate form initialization logic
  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: [this.category?.name || '', Validators.required],
      description: [this.category?.description || '', Validators.required],
    });
  }

  handleSubmit(): void {
    this.categoryForm.markAllAsTouched(); // Mark all fields as touched

    if (this.categoryForm.valid) {
      this.onSave.emit(this.categoryForm.value);
    } else {
      console.error('Formulario de categoría inválido.');
    }
  }

  // Auxiliary function to check if a field is invalid and has been touched
  confirmarCampo(controlName: string): boolean {
    const control = this.categoryForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}