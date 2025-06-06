import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scrollbar',
  imports: [CommonModule, NgClass],
  template: `
    <div class="custom-scrollbar-container" [ngClass]="[customMaxHeightClass, customOverflowClass]">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './scrollbar.component.css'
})
export class ScrollbarComponent {
  @Input() customMaxHeightClass: string = ''; // Recibe "max-h-[90vh]"
  @Input() customOverflowClass: string = 'overflow-y-auto'; // Recibe "overflow-y-auto" (o el que sea)
}
