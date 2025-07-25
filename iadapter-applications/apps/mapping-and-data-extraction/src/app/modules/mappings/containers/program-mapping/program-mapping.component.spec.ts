import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramMappingComponent } from './program-mapping.component';

describe('ProgramMappingComponent', () => {
    let component: ProgramMappingComponent;
    let fixture: ComponentFixture<ProgramMappingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProgramMappingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ProgramMappingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
