import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-register',
    imports: [CommonModule],
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    step = 1;
  
    nextStep() {
      if (this.step < 3) this.step++;
    }
  
    prevStep() {
      if (this.step > 1) this.step--;
    }
  }
