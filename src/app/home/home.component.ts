import { Component } from '@angular/core';
import { QRCodeGeneratorComponent } from "../qrcode-generator/qrcode-generator.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [QRCodeGeneratorComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {

constructor(
    private readonly router : Router,
) {}
toLogin() {
    this.router.navigate(['/login']);
}

toRegister(){
    this.router.navigate(['/register']);
}

    readonly url = 'https://www.gambaqr.com/'; 

}
