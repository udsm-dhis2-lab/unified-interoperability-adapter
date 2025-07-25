import {
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime, Observable, switchMap } from 'rxjs';
import { SharedModule } from '../../../../shared/shared.module';
import { ProgramManagementService } from '../../services/program-management.service';
import { MappingsUrls } from '../../models/constants/mappings-urls';

export interface ProgramStageSection {
    displayName: string;
    sortOrder: number;
    id: string;
    dataElements: DataElement[];
}

export interface DataElement {
    displayName: string;
    formName?: string;
    name: string;
    id: string;
    selected?: boolean;
}

export interface ProgramStage {
    allowGenerateNextVisit: boolean;
    formType: string;
    generatedByEnrollmentDate: boolean;
    displayName: string;
    description: string;
    validationStrategy: string;
    displayExecutionDateLabel: string;
    autoGenerateEvent: boolean;
    openAfterEnrollment: boolean;
    repeatable: boolean;
    name: string;
    featureType: string;
    hideDueDate: boolean;
    enableUserAssignment: boolean;
    id: string;
    minDaysFromStart: number;
    programStageSections: ProgramStageSection[];
}

export interface ProgramData {
    programType: string;
    onlyEnrollOnce: boolean;
    displayName: string;
    description: string;
    displayShortName: string;
    selectIncidentDatesInFuture: boolean;
    programStages: ProgramStage[];
}

@Component({
    selector: 'app-program-mapping',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './program-mapping.component.html',
    styleUrl: './program-mapping.component.css',
})
export class ProgramMappingComponent implements OnInit {
    isLoading = false;
    leftColumnSpan = 12;
    rightColumnSpan = 12;
    hasError = false;
    errorMessage = '';

    // Program data
    programData: ProgramData | null = null;
    programId: string = '';
    instanceId: string = '';
    selectedDataElement: DataElement | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private programManagementService: ProgramManagementService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.programId = params['id'];
            this.instanceId = params['instance'];

            if (this.programId && this.instanceId) {
                this.loadProgramData();
            } else {
                this.hasError = true;
                if (!this.programId && !this.instanceId) {
                    this.errorMessage = 'No program ID and instance provided. Please select a program from the list.';
                } else if (!this.programId) {
                    this.errorMessage = 'No program ID provided. Please select a program from the list.';
                } else {
                    this.errorMessage = 'No instance provided. Please select an instance.';
                }
            }
        });
    }

    loadProgramData(): void {
        this.isLoading = true;
        this.hasError = false;
        this.errorMessage = '';

        this.programManagementService.getProgramById(this.programId, MappingsUrls.GET_PROGRAMS_REMOTE, this.instanceId)
            .subscribe({
                next: (data) => {
                    this.programData = data.results[0] || null;
                    this.isLoading = false;
                    this.hasError = false;
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    console.error('Error loading program data:', error);
                    this.isLoading = false;
                    this.hasError = true;
                    this.errorMessage = error?.message || 'Failed to load program data. Please try again.';
                }
            });
    }


    onDataElementSelect(dataElement: DataElement): void {
        // Deselect previously selected element
        if (this.selectedDataElement && this.selectedDataElement.id !== dataElement.id) {
            this.selectedDataElement.selected = false;
        }

        // Toggle selection
        dataElement.selected = !dataElement.selected;
        this.selectedDataElement = dataElement.selected ? dataElement : null;
    }

    clearSelection(): void {
        if (this.selectedDataElement) {
            this.selectedDataElement.selected = false;
            this.selectedDataElement = null;
        }
    }

    onCollapse(): void {
        if (this.leftColumnSpan === 12) {
            this.leftColumnSpan = 8;
            this.rightColumnSpan = 16;
        } else {
            this.leftColumnSpan = 12;
            this.rightColumnSpan = 12;
        }
    }

    goBackToProgramList(): void {
        this.router.navigate(['/mapping-and-data-extraction'], {
            queryParams: {
                from: 'program-mapping',
                dataType: 'individual',
                instance: this.instanceId
            }
        });
    }

    get firstProgramStage(): ProgramStage | null {
        return this.programData?.programStages?.[0] || null;
    }

    trackBySection(index: number, section: ProgramStageSection): string {
        return section.id;
    }

    trackByDataElement(index: number, dataElement: DataElement): string {
        return dataElement.id;
    }
}
