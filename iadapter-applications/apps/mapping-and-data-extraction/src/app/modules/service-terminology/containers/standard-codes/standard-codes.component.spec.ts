import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardCodesComponent } from './standard-codes.component';

describe('StandardCodesComponent', () => {
  let component: StandardCodesComponent;
  let fixture: ComponentFixture<StandardCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardCodesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StandardCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
