import { Component } from '@angular/core';
import { MenuCardComponent } from "./menu-card/menu-card.component";

@Component({
  selector: 'app-menu',
  imports: [MenuCardComponent],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  addToCart() {
    throw new Error('Method not implemented.');
  }

}
