import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import QRCodeStyling from 'qr-code-styling';

@Component({
  selector: 'app-qr-code-generator',
  templateUrl: './qrcode-generator.component.html',
  standalone: true
})
export class QRCodeGeneratorComponent implements AfterViewInit {
  @Input() url: string = '';
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

  ngAfterViewInit(): void {
    this.qrCode.update({ data: this.url });

    const container = this.qrCodeContainer.nativeElement;
    container.innerHTML = '';
    this.qrCode.append(container);
  }
}
