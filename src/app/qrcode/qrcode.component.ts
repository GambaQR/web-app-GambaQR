import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser'; // Importar SafeUrl y DomSanitizer
import QRCodeStyling from 'qr-code-styling';

@Component({
  selector: 'qr',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex justify-center items-center m-5 group">
      <div #qrCodeContainer></div>
      <div
        class="absolute w-100 h-100 -z-10 bg-gradient-to-br from-pink-600 to-purple-600 opacity-15 group-hover:opacity-30 rounded-4xl blur-3xl transition duration-700"
      ></div>
    </div>
  `,
})
export class QRCodeComponent implements AfterViewInit, OnChanges {
  @Input() url!: SafeUrl; // El input sigue siendo SafeUrl

  @ViewChild('qrCodeContainer') qrCodeContainer!: ElementRef;

  readonly qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    image: "logo.svg",
    margin: 0,
    dotsOptions: {
      type: "rounded",
      gradient: {
        type: "radial",
        colorStops: [
          { offset: 0, color: "#FF69B4" },
          { offset: 1, color: "#8A2BE2" },
        ],
      },
    },
    backgroundOptions: {
      color: "transparent",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.5,
      margin: 15,
    },
    qrOptions: {
      errorCorrectionLevel: 'H',
    }
  });

  // Inyectamos DomSanitizer para acceder a SafeUrl
  constructor(private readonly sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    if (this.qrCodeContainer) {
        this.qrCodeContainer.nativeElement.innerHTML = '';
        this.qrCode.append(this.qrCodeContainer.nativeElement);
    }
    this.updateQrCodeData(); // Llama a la función de actualización inicial
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url'] && !changes['url'].firstChange) {
      this.updateQrCodeData();
    }
  }

  private updateQrCodeData(): void {
    let urlString: string = '';

    // ¡¡¡ESTA ES LA LÍNEA CLAVE QUE NECESITA SER REVISADA!!!
    // Esta es la forma "hacky" pero a menudo efectiva de extraer el string de SafeUrl
    // si el SafeUrl fue creado con bypassSecurityTrustUrl.
    if (this.url && (this.url as any).changingThisBreaksApplicationSecurity) {
        urlString = (this.url as any).changingThisBreaksApplicationSecurity;
    } else if (typeof this.url === 'string') {
        // En caso de que, por algún motivo, llegue como string directamente (aunque el input sea SafeUrl)
        urlString = this.url;
    } else {
        // Fallback si no se puede obtener la URL, o es nula
        console.warn('QRCodeComponent: URL input is not a SafeUrl or is empty.');
    }

    // Aquí es donde se pasa el string a la librería
    this.qrCode.update({
      data: urlString
    });
  }
}