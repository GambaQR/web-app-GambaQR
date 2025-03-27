import { Component } from '@angular/core';
import { fadeBackground, flyoutMenu, slideFromRight, slideInOut } from '../../assets/animations/animations';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [NgIf],
  animations: [flyoutMenu, slideInOut, slideFromRight, fadeBackground],
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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

}

