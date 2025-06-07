import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-layout',
    imports: [HeaderComponent, RouterModule],
    template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
})
export class LayoutComponent {

}
