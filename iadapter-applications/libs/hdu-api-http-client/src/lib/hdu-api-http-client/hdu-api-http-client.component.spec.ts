import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HduApiHttpClientComponent } from './hdu-api-http-client.component';

describe('HduApiHttpClientComponent', () => {
  let component: HduApiHttpClientComponent;
  let fixture: ComponentFixture<HduApiHttpClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HduApiHttpClientComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HduApiHttpClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
