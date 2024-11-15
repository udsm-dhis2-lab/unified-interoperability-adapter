import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralSettingsHomeComponent } from './general-settings-home.component';

describe('GeneralSettingsHomeComponent', () => {
  let component: GeneralSettingsHomeComponent;
  let fixture: ComponentFixture<GeneralSettingsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralSettingsHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralSettingsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
