import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleRunLoggingComponent } from './schedule-run-logging.component';

describe('ScheduleRunLoggingComponent', () => {
  let component: ScheduleRunLoggingComponent;
  let fixture: ComponentFixture<ScheduleRunLoggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleRunLoggingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleRunLoggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
