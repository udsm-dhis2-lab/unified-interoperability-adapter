import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowRunLoggingComponent } from './workflow-run-logging.component';

describe('WorkflowRunLoggingComponent', () => {
  let component: WorkflowRunLoggingComponent;
  let fixture: ComponentFixture<WorkflowRunLoggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowRunLoggingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowRunLoggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
