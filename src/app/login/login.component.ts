import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core'; // Asegúrate de que EventEmitter y Output estén aquí
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Asegúrate de que RouterLink esté aquí si se usa en HTML
import { AuthService } from '../services/auth/auth.service'; // Ajusta la ruta a tu AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // RouterLink debe estar aquí si se usa en el HTML del login
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword = false;
  errorMessage: string = '';

  @Output() loggedIn = new EventEmitter<void>(); // Evento para notificar éxito de login al padre
  @Output() cancel = new EventEmitter<void>(); // Evento para cerrar el modal/overlay (ej. por botón 'X')
  @Output() goToRegister = new EventEmitter<void>(); // Evento para cambiar a registro

  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router // Inyectar Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);

          // 1. Notificar al componente padre que el login fue exitoso.
          // El padre se encargará de cerrar el overlay.
          this.loggedIn.emit(); // ¡Emitir el evento aquí!

          // 2. Redirigir según el rol
          const role = response.role;
          if (role === 'CLIENT') {
            this.router.navigate(['/menu']); // Ruta para cliente (Menú del cliente)
          } else if (role === 'EMPLOYEE') {
            this.router.navigate(['/kitchen-display']); // Ruta para empleado (Vista de cocina)
          } else if (role === 'OWNER' || role === 'ADMIN') {
            this.router.navigate(['/restaurant']); // Ruta para dueño/admin (Panel del restaurante)
          } else {
            console.warn('Rol no reconocido:', role);
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

  confirmarCampo(campo: string): boolean {
    const control = this.loginForm.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onGoToRegisterClick(): void {
    this.goToRegister.emit();
  }

  // Método opcional para el botón 'X' de cerrar en el propio modal
  onCancelClick(): void {
    this.cancel.emit();
  }
}