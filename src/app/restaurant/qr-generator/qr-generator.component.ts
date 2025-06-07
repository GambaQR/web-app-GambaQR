import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { QRCodeComponent } from '../../qrcode/qrcode.component';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    QRCodeComponent // Importa tu componente de librería QR aquí
  ],
  templateUrl: './qr-generator.component.html',
})
export class QrGeneratorComponent {
  tableNumber: string = '';
  qrUrlSafe: SafeUrl | null = null; // Para el componente <qr>
  qrUrlString: string = ''; // Para el input de texto y copiar al portapapeles

  constructor(private readonly sanitizer: DomSanitizer) {}

  generateQR(): void {
    if (this.tableNumber) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
      const rawUrl = `${baseUrl}/menu?table=${this.tableNumber}`; // Guarda la URL como string
      this.qrUrlString = rawUrl; // Asigna el string a la nueva propiedad
      console.log('URL generada:', rawUrl); // Para depuración
      this.qrUrlSafe = this.sanitizer.bypassSecurityTrustUrl(rawUrl); // Sanea para el binding seguro
    } else {
      this.qrUrlSafe = null;
      this.qrUrlString = '';
    }
  }

  copyToClipboard(): void {
    if (this.qrUrlString && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.qrUrlString) // Usa la propiedad string
        .then(() => alert('URL copiada al portapapeles'))
        .catch(err => console.error('Error al copiar al portapapeles:', err));
    } else {
      alert('La URL no está disponible o el navegador no soporta la copia al portapapeles.');
    }
  }

  downloadQR(): void {
    alert("Función no implementada aún.");
  }
}