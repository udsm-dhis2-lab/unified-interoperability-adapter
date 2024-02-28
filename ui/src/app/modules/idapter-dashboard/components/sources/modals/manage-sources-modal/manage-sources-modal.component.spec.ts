import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSourcesModalComponent } from './manage-sources-modal.component';

describe('ManageSourcesModalComponent', () => {
  let component: ManageSourcesModalComponent;
  let fixture: ComponentFixture<ManageSourcesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSourcesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSourcesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
