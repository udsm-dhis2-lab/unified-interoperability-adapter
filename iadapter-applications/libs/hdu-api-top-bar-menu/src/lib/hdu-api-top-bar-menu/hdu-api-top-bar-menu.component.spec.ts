import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HduApiTopBarMenuComponent } from './hdu-api-top-bar-menu.component';

describe('HduApiTopBarMenuComponent', () => {
  let component: HduApiTopBarMenuComponent;
  let fixture: ComponentFixture<HduApiTopBarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HduApiTopBarMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HduApiTopBarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
