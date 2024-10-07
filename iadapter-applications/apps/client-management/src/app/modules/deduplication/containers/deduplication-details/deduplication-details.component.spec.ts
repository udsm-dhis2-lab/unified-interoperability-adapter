import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeduplicationDetailsComponent } from './deduplication-details.component';

describe('DeduplicationDetailsComponent', () => {
  let component: DeduplicationDetailsComponent;
  let fixture: ComponentFixture<DeduplicationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeduplicationDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeduplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
