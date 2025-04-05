import { Component, OnInit } from '@angular/core';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qrcode-generator',
  templateUrl: './qrcode-generator.component.html',
  styleUrl: './qrcode-generator.component.css',
})
export class QRCodeGeneratorComponent implements OnInit {
  qrCodeDataUrl: string = '';

  ngOnInit(): void {
    this.generateQRCode('www.gambaqr.com');
  }

  generateQRCode(data: string): void {
    QRCode.toDataURL(data, {
      color: {
        dark: '#9572FF',
        light: '#00000000'
      },
      version: 5,
      scale: 50,
      errorCorrectionLevel: 'H',
    })
      .then(url => {
        this.qrCodeDataUrl = url;
      })
      .catch(err => {
        console.error(err);
      });
  }
}
