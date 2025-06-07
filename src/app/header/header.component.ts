import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { fadeBackground, flyoutMenu, slideFromRight, slideInOut } from '../../assets/animations/animations';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { OverlayComponent } from '../overlay/overlay.component'; // Asegúrate de la ruta
import { LoginComponent } from '../login/login.component';           // Asegúrate de la ruta
import { RegisterComponent } from '../register/register.component';     // Asegúrate de la ruta
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgIf,
    NgClass,
    OverlayComponent,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './header.component.html',
  animations: [flyoutMenu, slideInOut, slideFromRight, fadeBackground],
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isScrolled: boolean = false;
  isOpen: boolean = false; // Estado del menú móvil

  showLoginOverlay: boolean = false; // Estado del overlay de login
  showRegisterOverlay: boolean = false; // Estado del overlay de registro

  isAuthenticated: boolean = false;
  private authSubscription!: Subscription;

  nav: { [key: string]: boolean } = { product: false, features: false };
  sidebar: { [key: string]: boolean } = { product: false, features: false };

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        // Si el usuario se desloguea, asegúrate de que los overlays estén cerrados
        if (!isAuthenticated) {
          this.showLoginOverlay = false;
          this.showRegisterOverlay = false;
        }
      }
    );

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  toggleNav(section: string) {
    this.nav[section] = !this.nav[section];
  }

  toggleSidebar(section: string) {
    this.sidebar[section] = !this.sidebar[section];
  }

  toggleTheme() {
    const htmlElement = document.documentElement;
    const isDark = htmlElement.classList.contains('dark');
    htmlElement.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  }

  // --- Métodos de Apertura de Overlays (llamados desde botones del Header) ---
  openLoginOverlay(): void {
    this.showLoginOverlay = true;
    this.showRegisterOverlay = false; // Asegura que Register esté cerrado
    if (this.isOpen) { // Si el menú móvil está abierto, ciérralo
      this.toggleMenu();
    }
  }

  openRegisterOverlay(): void {
    this.showRegisterOverlay = true;
    this.showLoginOverlay = false; // Asegura que Login esté cerrado
    if (this.isOpen) { // Si el menú móvil está abierto, ciérralo
      this.toggleMenu();
    }
  }

  // --- Métodos de Cierre de Overlays (llamados por el OverlayComponent) ---
  onLoginOverlayClose(): void {
    this.showLoginOverlay = false;
  }

  onRegisterOverlayClose(): void {
    this.showRegisterOverlay = false;
  }

  // --- Métodos para el Switch entre Overlays (llamados por Login/Register Components) ---
  onSwitchToRegister(): void {
    this.showLoginOverlay = false;  
    this.showRegisterOverlay = true; 
  }

  onSwitchToLogin(): void {
    this.showRegisterOverlay = false; 
    this.showLoginOverlay = true;   
  }

  // --- Métodos de Éxito de Autenticación (llamados por Login/Register Components) ---
  onLoginSuccess(): void {
    this.showLoginOverlay = false;
  }

  onRegisterSuccess(): void {
    this.showRegisterOverlay = false; 
    this.onSwitchToLogin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirigir al inicio o a la página de login
    if (this.isOpen) { // Si el menú móvil está abierto, ciérralo
      this.toggleMenu();
    }
  }
}