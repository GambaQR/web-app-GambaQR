import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from "../qrcode/qrcode.component";
import { Router } from '@angular/router';

import { OverlayComponent } from '../overlay/overlay.component'; // Asegúrate de que la ruta sea correcta
import { LoginComponent } from '../login/login.component'; // Asegúrate de que la ruta sea correcta
import { RegisterComponent } from '../register/register.component'; // ¡Importar RegisterComponent!
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, QRCodeComponent, OverlayComponent, LoginComponent, RegisterComponent], // ¡Añadir RegisterComponent a imports!
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  url!: SafeUrl;

  showLoginOverlay: boolean = false;
  showRegisterOverlay: boolean = false; // ¡Nueva propiedad para el overlay de registro!

  constructor(
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const rawUrl = 'http://localhost:4200/cliente?table=1';
    this.url = this.sanitizer.bypassSecurityTrustUrl(rawUrl);
  }

  toLogin(): void {
    this.showLoginOverlay = true;
  }

  // Método para abrir el overlay de registro
  toRegister(): void {
    this.showRegisterOverlay = true;
  }

  onLoginOverlayClose(): void {
    this.showLoginOverlay = false;
  }

  // Método para cerrar el overlay de registro (llamado por el OverlayComponent)
  onRegisterOverlayClose(): void {
    this.showRegisterOverlay = false;
  }

  // Método opcional si el LoginComponent emite loggedIn. No es estrictamente necesario aquí
  // ya que el login te podría redirigir directamente, pero es un ejemplo de cómo manejarlo
  onLoginSuccess(): void {
    this.showLoginOverlay = false;
    // this.router.navigate(['/restaurante']); // Ejemplo: redirigir tras login exitoso
  }

  // Método opcional si el RegisterComponent emite registered.
  onRegisterSuccess(): void {
    this.showRegisterOverlay = false;
    // Opcional: Podrías abrir el login después del registro, o redirigir
    // this.showLoginOverlay = true;
    // this.router.navigate(['/restaurante']);
  }
}