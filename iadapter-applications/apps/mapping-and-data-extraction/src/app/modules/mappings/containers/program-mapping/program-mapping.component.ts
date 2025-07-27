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
import { FormsModule } from '@angular/forms';
import { CodeEditorComponent } from '../../../../shared/components/sql-editor/sql-editor.component';

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
    optionSet?: OptionSet;
    type?: string;
    code?: string;
}

export interface OptionSet {
    name: string;
    id: string;
    options: Option[];
}

export interface Option {
    code: string;
    name: string;
    id: string;
}

export interface DataParam {
    type: string;
    value: {
        code: string;
        type: string;
        block: string;
    };
    mappings?: CodeMapping[];
}

export interface CodeMapping {
    inputCodes: string[];
    operator: string;
    outputCode: string;
}

export interface MappingData {
    uuid?: string;
    dataKey: string;
    mapping: {
        dataElement: {
            id: string;
            name: string;
            programStage?: string;
            program?: string;
            code: string;
            type: string;
        };
        dataParams: DataParam[];
        junctionOperator: string;
        customScript?: string;
    };
    namespace: string;
    description: string;
    group: any;
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
    imports: [SharedModule, FormsModule, CodeEditorComponent],
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

    // Mapping data
    currentMapping: MappingData | null = null;
    junctionOperator: string = '';
    selectedDataParams: DataParam[] = [];
    customScript: string = '';
    showCodedMappings: boolean = false;
    showCustomScript: boolean = false;

    // Mock data template fields (in real app, this would come from API)
    dataTemplateFields = [
        { code: 'reportingDateTime', type: 'DATETIME', block: 'reportingDetails', label: 'Reporting Date Time' },
        { code: 'firstName', type: 'TEXT', block: 'demographicDetails', label: 'First Name' },
        { code: 'surname', type: 'TEXT', block: 'demographicDetails', label: 'Surname' },
        { code: 'sex', type: 'TEXT', block: 'demographicDetails', label: 'Sex' },
        { code: 'dateOfBirth', type: 'DATE', block: 'demographicDetails', label: 'Date of Birth' },
        { code: 'placeOfBirth', type: 'TEXT', block: 'demographicDetails', label: 'Place of Birth' },
        { code: 'address', type: 'TEXT', block: 'addressDetails', label: 'Address' },
        { code: 'phoneNumber', type: 'TEXT', block: 'contactDetails', label: 'Phone Number' },
    ];

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

        // Initialize mapping when element is selected
        if (this.selectedDataElement) {
            this.initializeMapping();
        } else {
            this.currentMapping = null;
        }
    }

    initializeMapping(): void {
        if (!this.selectedDataElement) return;

        this.currentMapping = {
            dataKey: this.selectedDataElement.id,
            mapping: {
                dataElement: {
                    id: this.selectedDataElement.id,
                    name: this.selectedDataElement.displayName,
                    programStage: this.firstProgramStage?.id || '',
                    program: this.programData?.programStages?.[0]?.id || '',
                    code: this.selectedDataElement.code || '',
                    type: this.selectedDataElement.type || 'TEXT'
                },
                dataParams: [],
                junctionOperator: this.junctionOperator
            },
            namespace: `MAPPINGS-${this.programId}`,
            description: '',
            group: null
        };

        // Reset mapping state
        this.selectedDataParams = [];
        this.customScript = '';
        this.showCodedMappings = false;
        this.showCustomScript = false;
    }

    updateMappingStructure(): void {
        if (!this.currentMapping) return;

        this.currentMapping.mapping.dataParams = [...this.selectedDataParams];

        if (this.customScript && this.customScript.trim()) {
            this.currentMapping.mapping.customScript = this.customScript;
        } else {
            delete this.currentMapping.mapping.customScript;
        }

        this.currentMapping.mapping.junctionOperator = this.junctionOperator;
    }

    addDataParam(): void {
        const newParam: DataParam = {
            type: 'dataTemplateField',
            value: {
                code: '',
                type: '',
                block: ''
            }
        };

        this.selectedDataParams.push(newParam);
        this.updateMappingStructure();
    }

    removeDataParam(index: number): void {
        this.selectedDataParams.splice(index, 1);
        this.updateMappingStructure();
    }

    updateDataParam(index: number, field: any): void {
        if (this.selectedDataParams[index]) {
            this.selectedDataParams[index].value = {
                code: field.code,
                type: field.type,
                block: field.block
            };
            this.updateMappingStructure();
        }
    }

    onDataParamFieldChange(index: number, fieldCode: string): void {
        const field = this.dataTemplateFields.find(f => f.code === fieldCode);
        if (field) {
            this.updateDataParam(index, field);
        }
    }

    updateInputCodes(mapping: CodeMapping, inputText: string): void {
        mapping.inputCodes = inputText.split(',').map(s => s.trim()).filter(s => s);
        this.updateMappingStructure();
    }

    isFieldAlreadySelected(fieldCode: string, currentIndex: number): boolean {
        return this.selectedDataParams.some((p, idx) => idx !== currentIndex && p.value.code === fieldCode);
    }

    addCodeMapping(paramIndex: number): void {
        if (this.selectedDataParams[paramIndex]) {
            if (!this.selectedDataParams[paramIndex].mappings) {
                this.selectedDataParams[paramIndex].mappings = [];
            }
            this.selectedDataParams[paramIndex].mappings!.push({
                inputCodes: [],
                operator: 'IN',
                outputCode: ''
            });
            this.updateMappingStructure();
        }
    }

    updateJunctionOperator(operator: string): void {
        this.junctionOperator = operator;
        this.updateMappingStructure();
    }

    updateCustomScript(script: string): void {
        this.customScript = script;
        this.updateMappingStructure();
    }

    saveMapping(): void {
        if (!this.currentMapping) return;

        if (!this.currentMapping.uuid) {
            this.currentMapping.uuid = this.generateUUID();
        }

        console.log('Saving mapping:', JSON.stringify(this.currentMapping, null, 2));
        // TODO: Implement actual save logic
    }

    generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    clearSelection(): void {
        if (this.selectedDataElement) {
            this.selectedDataElement.selected = false;
            this.selectedDataElement = null;
        }
        this.currentMapping = null;
        this.selectedDataParams = [];
        this.customScript = '';
        this.showCodedMappings = false;
        this.showCustomScript = false;
    }

    onCollapse(): void {
        if (this.rightColumnSpan === 12) {
            // Expand the right column for mapping
            this.leftColumnSpan = 8;
            this.rightColumnSpan = 16;
        } else {
            // Collapse back to equal columns
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
