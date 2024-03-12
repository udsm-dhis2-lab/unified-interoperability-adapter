import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInstanceModalComponent } from './manage-instance-modal.component';

describe('ManageInstanceModalComponent', () => {
  let component: ManageInstanceModalComponent;
  let fixture: ComponentFixture<ManageInstanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInstanceModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageInstanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
