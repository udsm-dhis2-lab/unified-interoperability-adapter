import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessSummaryComponent } from './process-summary.component';

describe('ProcessSummaryComponent', () => {
  let component: ProcessSummaryComponent;
  let fixture: ComponentFixture<ProcessSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
