import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralManagementComponent } from './referral-management.component';

describe('ReferralManagementComponent', () => {
  let component: ReferralManagementComponent;
  let fixture: ComponentFixture<ReferralManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
