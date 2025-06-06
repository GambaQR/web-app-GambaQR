import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'GambaQR';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    const username = this.authService.getUsername();

    if (token && username) {
      this.authService.checkToken(token, username).subscribe({
        next: (isValid) => {
          console.log('¿Token válido?', isValid);
          if (!isValid) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          console.error('Error al verificar el token');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
    } else {
      // No hay token → no sesión activa
      console.log('No hay token guardado, usuario no autenticado.');
      this.authService.logout();
    }
  }
}