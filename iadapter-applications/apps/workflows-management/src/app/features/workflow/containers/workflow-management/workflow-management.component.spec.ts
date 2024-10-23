import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowManagementComponent } from './workflow-management.component';

describe('WorkflowManagementComponent', () => {
  let component: WorkflowManagementComponent;
  let fixture: ComponentFixture<WorkflowManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
