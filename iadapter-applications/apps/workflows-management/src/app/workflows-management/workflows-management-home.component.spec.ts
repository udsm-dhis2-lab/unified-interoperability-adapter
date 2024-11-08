import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowsManagementHomeComponent } from './workflows-management-home.component';

describe('WorkflowsManagementHomeComponent', () => {
  let component: WorkflowsManagementHomeComponent;
  let fixture: ComponentFixture<WorkflowsManagementHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowsManagementHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowsManagementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
