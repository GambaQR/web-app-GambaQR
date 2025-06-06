import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { QRCodeComponent } from '../../qrcode/qrcode.component';
import { QrCodeService, QrCodeRequest } from '../../services/qr-code.service';



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
  restaurantId = 3; // ⚠️ Obtén el ID dinámicamente según el usuario


  constructor(private readonly sanitizer: DomSanitizer, private qrCodeService: QrCodeService) { }

  generateQR(): void {
    if (this.tableNumber) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
      const rawUrl = `${baseUrl}/menu?table=${this.tableNumber}`;
      this.qrUrlString = rawUrl;
      this.qrUrlSafe = this.sanitizer.bypassSecurityTrustUrl(rawUrl);
    } else {
      this.qrUrlSafe = null;
      this.qrUrlString = '';
    }
  }

  saveQrCode(): void {
    const qrData: QrCodeRequest = {
      restaurantId: this.restaurantId,
      tableNumber: parseInt(this.tableNumber),
      qrUrl: this.qrUrlString,
      isGeneral: false
    };

    this.qrCodeService.createQrCode(qrData).subscribe({
      next: (response) => {
        console.log('QR guardado en la base de datos:', response);
        alert('Código QR guardado correctamente. Descargando...');
        this.downloadQR();
      },
      error: (err) => console.error('Error al guardar QR:', err)
    });
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
    console.log('Pendiente de implementar...');
    alert('Pendiente de implementar...');
  }


}