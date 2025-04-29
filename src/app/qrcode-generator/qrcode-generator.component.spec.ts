import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodeGeneratorComponent } from './qrcode-generator.component';

describe('QRCodeGeneratorComponent', () => {
  let component: QRCodeGeneratorComponent;
  let fixture: ComponentFixture<QRCodeGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QRCodeGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QRCodeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
