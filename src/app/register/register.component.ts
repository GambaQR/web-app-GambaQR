import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true, // Agregado standalone si no lo tenías para componentes modernos
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  paso = 1;
  maxPaso = 3;
  showPassword = false;
  showConfirmPassword = false;
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      // Paso 1: Información de cuenta
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Añadido minLength
      confirmPassword: ['', Validators.required],

      // Paso 2: Tipo de cuenta (inicialmente vacío, se llenará con la selección)
      tipoCuenta: ['', Validators.required],

      // Paso 3: Información personal (inicialmente vacíos)
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]], // Ejemplo de validación de teléfono
    }, { validators: this.passwordMatchValidator }); // Agregado el validador a nivel de FormGroup
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true }); // Establece el error en el control de confirmación
      return { mismatch: true }; // Error a nivel de formulario
    } else if (confirmPassword?.hasError('mismatch')) {
        // Si no hay mismatch, pero el error estaba previamente seteado, lo removemos
        confirmPassword.setErrors(null);
    }
    return null;
  }

  siguientePaso() {
    let currentFormSectionValid = true;

    if (this.paso === 1) {
      // Marcar campos del paso 1 como tocados para mostrar errores
      this.form.get('usuario')?.markAsTouched();
      this.form.get('email')?.markAsTouched();
      this.form.get('password')?.markAsTouched();
      this.form.get('confirmPassword')?.markAsTouched();

      // Verificar validez de los campos del paso 1
      if (this.form.get('usuario')?.invalid ||
          this.form.get('email')?.invalid ||
          this.form.get('password')?.invalid ||
          this.form.get('confirmPassword')?.invalid ||
          this.form.hasError('mismatch')) {
        currentFormSectionValid = false;
      }
    } else if (this.paso === 2) {
      // Marcar campo del paso 2 como tocado
      this.form.get('tipoCuenta')?.markAsTouched();

      // Verificar validez del campo del paso 2
      if (this.form.get('tipoCuenta')?.invalid) {
        currentFormSectionValid = false;
      }
    }
    // No necesitamos validación explícita para el paso 3 aquí, ya que el botón "Registrar" lo valida

    if (currentFormSectionValid && this.paso < this.maxPaso) {
      this.paso++;
    }
  }

  pasoAnterior() {
    if (this.paso > 1) {
      this.paso--;
    }
  }

  calcularProgreso(): number {
    // Ajustamos el cálculo para que el progreso sea más intuitivo
    // 1er paso: 0%, 2do paso: 50%, 3er paso: 100%
    if (this.maxPaso <= 1) return 100;
    return (this.paso - 1) * (100 / (this.maxPaso - 1));
  }

  enviarFormulario() {
    // Marcar todos los campos como tocados al intentar enviar el formulario final
    this.form.markAllAsTouched();

    if (this.form.valid) {
      console.log('Formulario válido, datos:', this.form.value);
      // Aquí podrías enviar los datos a un servicio o API
      alert('¡Registro exitoso!');
    } else {
      console.error('Formulario inválido, revisa los errores.');
      // Puedes añadir lógica para desplazar la vista al primer error si es necesario
    }
  }

  // Función auxiliar para verificar si un campo es inválido y ha sido tocado
  confirmarCampo(campo: string): boolean {
    const control = this.form.get(campo);
    // Devuelve true si el control existe, es inválido y ha sido tocado o "dirty" (modificado)
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    // Esta función debe controlar showConfirmPassword
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}