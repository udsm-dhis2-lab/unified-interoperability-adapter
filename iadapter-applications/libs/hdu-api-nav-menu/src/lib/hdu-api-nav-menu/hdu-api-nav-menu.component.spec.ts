import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HduApiNavMenuComponent } from './hdu-api-nav-menu.component';

describe('HduApiNavMenuComponent', () => {
  let component: HduApiNavMenuComponent;
  let fixture: ComponentFixture<HduApiNavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HduApiNavMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HduApiNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
