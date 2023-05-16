import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IadapterDashboardComponent } from './iadapter-dashboard.component';

describe('IadapterDashboardComponent', () => {
  let component: IadapterDashboardComponent;
  let fixture: ComponentFixture<IadapterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IadapterDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IadapterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
