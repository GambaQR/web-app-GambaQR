import { Component } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
    selector: 'app-home',
    imports: [QRCodeComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {

}
