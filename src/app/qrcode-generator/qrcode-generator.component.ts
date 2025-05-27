import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import QRCodeStyling from 'qr-code-styling';

@Component({

  selector: 'qr',
  template: `
  <div class="relative flex justify-center items-center m-5 group">
  <div #qrCodeContainer></div>
  <div
    class="absolute bg-gradient-to-br from-pink-600 to-purple-600 w-100 h-100 -z-10 opacity-15 group-hover:opacity-30 rounded-4xl blur-3xl transition duration-700"
  ></div>
</div>`,
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
