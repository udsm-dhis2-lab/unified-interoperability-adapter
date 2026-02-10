import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemConnectionCreate } from './system-connection-create';

describe('SystemConnectionCreate', () => {
  let component: SystemConnectionCreate;
  let fixture: ComponentFixture<SystemConnectionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemConnectionCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemConnectionCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
