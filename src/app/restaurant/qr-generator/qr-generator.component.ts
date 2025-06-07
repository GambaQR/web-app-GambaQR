import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { QRCodeComponent } from '../../qrcode/qrcode.component';
import { QrCodeService } from '../../services/qr-code.service';
import { QrCodeRequest } from '../../services/qr-code.service';
import { QrCodeResponse } from '../../services/qr-code.service';
import QRCode from "qrcode";



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

  constructor(private readonly sanitizer: DomSanitizer, private qrCodeService: QrCodeService,) { }

  generateQR(): void {
    if (this.tableNumber) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
      const rawUrl = `${baseUrl}/menu?table=${this.tableNumber}`;
      this.qrUrlString = rawUrl;
      this.qrUrlSafe = this.sanitizer.bypassSecurityTrustUrl(rawUrl);

      // ✅ Guardar en la base de datos
      const qrRequest: QrCodeRequest = {
        restaurantId: 1, // ⚠️ Ajustar según el restaurante actual
        tableNumber: Number(this.tableNumber), // Convertir a número
        qrUrl: rawUrl,
        isGeneral: false
      };

      this.qrCodeService.createQrCode(qrRequest).subscribe({
        next: (response: QrCodeResponse) => {
          console.log("QR guardado en la BD:", response);
        },
        error: (err) => {
          console.error("Error al guardar el QR:", err);
        }
      });

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
    if (!this.qrUrlString) {
      alert("No hay un QR generado.");
      return;
    }

    QRCode.toDataURL(this.qrUrlString, { type: "image/png" })
      .then((imgData) => {
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `QR_Mesa_${this.tableNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("QR descargado correctamente.");
      })
      .catch((err) => console.error("Error al generar la imagen del QR:", err));
  }

}