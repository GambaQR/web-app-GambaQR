import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenDisplayComponent } from './kitchen-display.component';

describe('KitchenDisplayComponent', () => {
  let component: KitchenDisplayComponent;
  let fixture: ComponentFixture<KitchenDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
