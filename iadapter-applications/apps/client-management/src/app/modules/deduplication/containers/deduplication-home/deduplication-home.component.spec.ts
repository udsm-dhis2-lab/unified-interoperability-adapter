import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeduplicationHomeComponent } from './deduplication-home.component';

describe('DeduplicationHomeComponent', () => {
  let component: DeduplicationHomeComponent;
  let fixture: ComponentFixture<DeduplicationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeduplicationHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeduplicationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
