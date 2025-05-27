import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [],
    templateUrl: './not-found.component.html'
})
export class NotFoundComponent {
    constructor(private readonly router: Router) { }

    goHome() {
        this.router.navigate(['/']);
    }

    toRegister() {
        this.router.navigate(['/register']);
    }
}
