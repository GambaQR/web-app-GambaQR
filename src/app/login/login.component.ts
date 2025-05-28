import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importar ReactiveFormsModule y sus clases
import { RouterLink } from '@angular/router'; // Importar RouterLink para los enlaces de navegación

@Component({
  selector: 'app-login',
  standalone: true, // Se recomienda usar 'standalone: true' en componentes nuevos de Angular
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Añadir ReactiveFormsModule y RouterLink
  templateUrl: './login.component.html',
  // Si tienes un archivo de estilos específico para este componente, añádelo aquí:
  // styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Propiedad para controlar la visibilidad de la contraseña
  showPassword = false;

  // FormGroup para manejar el estado y la validación del formulario de login
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicialización del FormGroup con los controles y sus validadores
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo de email: requerido y formato de email
      password: ['', [Validators.required, Validators.minLength(6)]], // Campo de contraseña: requerido y mínimo 6 caracteres
      rememberMe: [false] // Checkbox "Recordarme": valor inicial falso
    });
  }

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Función que se ejecuta al enviar el formulario
  onSubmit() {
    // Marca todos los controles del formulario como 'touched' para mostrar los errores de validación
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      // Si el formulario es válido, imprime los valores en consola
      console.log('Formulario de login válido:', this.loginForm.value);
      // Aquí iría la lógica para enviar los datos al servidor (ej. un servicio de autenticación)
      alert('¡Inicio de sesión exitoso!'); // Mensaje de éxito temporal
      // Ejemplo: this.authService.login(this.loginForm.value).subscribe(...)
    } else {
      // Si el formulario no es válido, imprime un mensaje de error
      console.error('Formulario de login inválido. Por favor, revisa los campos.');
    }
  }

  // Función auxiliar para verificar si un campo es inválido y ha sido tocado
  // Esto es útil para mostrar mensajes de error solo después de que el usuario interactúa con el campo
  confirmarCampo(campo: string): boolean {
    const control = this.loginForm.get(campo);
    // Devuelve true si el control existe, es inválido y ha sido tocado o modificado (dirty)
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}