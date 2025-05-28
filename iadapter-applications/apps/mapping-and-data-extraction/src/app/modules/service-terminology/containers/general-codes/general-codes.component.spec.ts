import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralCodesComponent } from './general-codes.component';

describe('GeneralCodesComponent', () => {
  let component: GeneralCodesComponent;
  let fixture: ComponentFixture<GeneralCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralCodesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
