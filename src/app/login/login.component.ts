import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importar ReactiveFormsModule y sus clases
import { Router, RouterLink } from '@angular/router'; // Importar RouterLink para los enlaces de navegación
import { AuthService } from '../services/auth/auth.service';


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
  errorMessage: string = '';

  // FormGroup para manejar el estado y la validación del formulario de login
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicialización del FormGroup con los controles y sus validadores
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], // Campo de email: requerido y formato de email
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
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);

          // Extrae el rol del usuario autenticado
          const role = response.role;

          // Redirige según el rol
          if (role === 'CLIENT') {
            this.router.navigate(['/menu']);
          } else if (role === 'EMPLOYEE') {
            this.router.navigate(['/kitchen']);
          } else if (role === 'OWNER' || role === 'ADMIN') {
            this.router.navigate(['/restaurant']);
          } else {
            this.router.navigate(['/']); // Fallback si el rol no es reconocido
          }
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          this.errorMessage = 'Credenciales incorrectas o error en el servidor.';
        }
      });
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