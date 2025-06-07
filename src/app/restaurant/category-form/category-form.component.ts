import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Para Reactive Forms
import { MenuCategory } from '../../restaurant-panel/restaurant-panel.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, NgIf, NgClass, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  @Input() category: MenuCategory | null = null; // Si se pasa una categoría, es para editar
  @Output() onSave = new EventEmitter<Omit<MenuCategory, 'id' | 'createdAt'>>();
  @Output() onCancel = new EventEmitter<void>();

  categoryForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [this.category?.name || '', Validators.required],
      description: [this.category?.description || '', Validators.required],
    });
  }

  handleSubmit(): void {
    this.categoryForm.markAllAsTouched(); // Marcar todos los campos como tocados

    if (this.categoryForm.valid) {
      this.onSave.emit(this.categoryForm.value);
    } else {
      console.error('Formulario de categoría inválido.');
    }
  }

  // Función auxiliar para verificar si un campo es inválido y ha sido tocado
  confirmarCampo(controlName: string): boolean {
    const control = this.categoryForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}