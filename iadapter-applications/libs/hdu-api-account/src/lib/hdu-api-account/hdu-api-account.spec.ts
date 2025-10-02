import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HduApiAccount } from './hdu-api-account';

describe('HduApiAccount', () => {
  let component: HduApiAccount;
  let fixture: ComponentFixture<HduApiAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HduApiAccount],
    }).compileComponents();

    fixture = TestBed.createComponent(HduApiAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
