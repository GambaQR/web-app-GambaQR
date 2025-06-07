import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from "../qrcode/qrcode.component";
import { Router } from '@angular/router';

import { OverlayComponent } from '../overlay/overlay.component'; 
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component'; 
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, QRCodeComponent, OverlayComponent, LoginComponent, RegisterComponent, FooterComponent], 
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  url!: SafeUrl;

  showLoginOverlay: boolean = false;
  showRegisterOverlay: boolean = false; 

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
  }

  // Método opcional si el RegisterComponent emite registered.
  onRegisterSuccess(): void {
    this.showRegisterOverlay = false;
    // Opcional: Podrías abrir el login después del registro, o redirigir
    // this.showLoginOverlay = true;
    // this.router.navigate(['/restaurante']);
  }

  onSwitchToRegister(): void {
    this.showLoginOverlay = false; 
    this.showRegisterOverlay = true;
  }

  onSwitchToLogin(): void {
    this.showRegisterOverlay = false;
    this.showLoginOverlay = true;  
  }
}