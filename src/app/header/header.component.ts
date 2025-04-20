import { Component, HostListener, OnInit } from '@angular/core';
import { fadeBackground, flyoutMenu, slideFromRight, slideInOut } from '../../assets/animations/animations';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    imports: [RouterModule, CommonModule, NgIf],
    animations: [flyoutMenu, slideInOut, slideFromRight, fadeBackground],
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public isScrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  
  isOpen: boolean = false;

  nav: { [key: string]: boolean } = {
    product: false,
    features: false,
  }

  sidebar: { [key: string]: boolean } = {
    product: false,
    features: false,
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

    // Ahora alternamos el modo oscuro
    htmlElement.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  }

  ngOnInit() {
    // Cargar el tema guardado
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

}

