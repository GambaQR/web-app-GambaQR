import { Component } from '@angular/core';
import { QRCodeGeneratorComponent } from "../qrcode-generator/qrcode-generator.component";

@Component({
  selector: 'app-example',
  imports: [QRCodeGeneratorComponent],
  templateUrl: './example.component.html'
})
export class ExampleComponent {

  readonly url = 'https://www.gambaqr.com/';
}
