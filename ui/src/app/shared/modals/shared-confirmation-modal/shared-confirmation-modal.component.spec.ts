import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedConfirmationModalComponent } from './shared-confirmation-modal.component';

describe('SharedConfirmationModalComponent', () => {
  let component: SharedConfirmationModalComponent;
  let fixture: ComponentFixture<SharedConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedConfirmationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
