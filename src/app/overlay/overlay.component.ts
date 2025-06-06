import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ScrollbarComponent } from "../scrollbar/scrollbar.component";

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, NgIf, ScrollbarComponent],
  templateUrl: './overlay.component.html',
})
export class OverlayComponent {
 // Propiedad para definir el ancho máximo del overlay
  @Input() maxWidthClass: string = 'max-w-sm';
  // Propiedad para controlar la visibilidad del overlay
  @Input() isOpen: boolean = false;
  // Propiedad para permitir o no cerrar haciendo clic fuera del contenido
  @Input() closeOnBackdropClick: boolean = true;
  // Evento para notificar al padre que el overlay debe cerrarse
  @Output() close = new EventEmitter<void>();

  // Maneja el clic en el fondo semitransparente
  onBackdropClick(event: MouseEvent): void {
    // Si el clic no fue en el contenido principal del modal
    if (this.closeOnBackdropClick && (event.target as HTMLElement).classList.contains('overlay-backdrop')) {
      this.close.emit();
    }
  }

  // Maneja el clic en el botón de cerrar (si se añade uno en el contenido proyectado)
  onCloseButtonClick(): void {
    this.close.emit();
  }
}