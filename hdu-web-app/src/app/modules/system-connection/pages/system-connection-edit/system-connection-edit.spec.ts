import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemConnectionEdit } from './system-connection-edit';

describe('SystemConnectionEdit', () => {
  let component: SystemConnectionEdit;
  let fixture: ComponentFixture<SystemConnectionEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemConnectionEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemConnectionEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
