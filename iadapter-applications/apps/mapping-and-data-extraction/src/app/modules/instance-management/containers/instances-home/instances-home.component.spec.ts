import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstancesHomeComponent } from './instances-home.component';

describe('InstancesHomeComponent', () => {
  let component: InstancesHomeComponent;
  let fixture: ComponentFixture<InstancesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstancesHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstancesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
