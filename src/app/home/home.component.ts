import { Component } from '@angular/core';
import { QRCodeComponent } from "../qrcode/qrcode.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [QRCodeComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {

    readonly url = 'http://localhost:4200/cliente?table=1';

    constructor(
        private readonly router: Router,
    ) { }
    toLogin() {
        this.router.navigate(['/login']);
    }

    toRegister() {
        this.router.navigate(['/register']);
    }


}
