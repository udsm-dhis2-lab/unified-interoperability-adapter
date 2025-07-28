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
    showOptionMappings?: boolean;
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

    // Mapping management properties
    isSubmittingMapping = false;
    isDeletingMapping = false;
    mappingUuid?: string;
    alert = {
        show: false,
        type: '',
        message: '',
    };

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
            this.loadExistingMapping();
        } else {
            this.currentMapping = null;
            this.mappingUuid = undefined;
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
                    program: this.programId,
                    code: this.selectedDataElement.code || '',
                    type: this.selectedDataElement.type || ''
                },
                dataParams: [],
                junctionOperator: this.junctionOperator
            },
            namespace: `PROGRAM-${this.programId}`,
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
            },
            showOptionMappings: true
        };

        this.selectedDataParams.push(newParam);
        this.updateMappingStructure();
    }

    removeDataParam(index: number): void {
        this.selectedDataParams.splice(index, 1);
        this.updateMappingStructure();
    }

    addDataParamField(index: number): void {
        if (!this.selectedDataParams[index]) return;

        const newField = this.dataTemplateFields[0]; // Default to first field for simplicity
        this.selectedDataParams[index].value = {
            code: newField.code,
            type: newField.type,
            block: newField.block
        };
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

    updateJunctionOperator(operator: string): void {
        this.junctionOperator = operator;
        this.updateMappingStructure();
    }

    updateCustomScript(script: string): void {
        this.customScript = script;
        this.updateMappingStructure();
    }

    getOptionMapping(paramIndex: number, optionCode: string): CodeMapping | undefined {
        if (!this.selectedDataParams[paramIndex]?.mappings) {
            return undefined;
        }
        return this.selectedDataParams[paramIndex].mappings!.find(mapping => mapping.outputCode === optionCode);
    }

    getOptionMappingInputCodes(paramIndex: number, optionCode: string): string {
        const mapping = this.getOptionMapping(paramIndex, optionCode);
        return mapping ? mapping.inputCodes.join(', ') : '';
    }

    updateOptionMapping(paramIndex: number, optionCode: string, inputText: string): void {
        if (!this.selectedDataParams[paramIndex]) return;

        // Initialize mappings array if it doesn't exist
        if (!this.selectedDataParams[paramIndex].mappings) {
            this.selectedDataParams[paramIndex].mappings = [];
        }

        const mappings = this.selectedDataParams[paramIndex].mappings!;
        let mapping = mappings.find(m => m.outputCode === optionCode);

        if (!mapping) {
            // Create new mapping if it doesn't exist
            mapping = {
                inputCodes: [],
                operator: 'IN',
                outputCode: optionCode
            };
            mappings.push(mapping);
        }

        // Update input codes
        mapping.inputCodes = inputText.split(',').map(s => s.trim()).filter(s => s);

        // Remove mapping if no input codes
        if (mapping.inputCodes.length === 0) {
            const index = mappings.indexOf(mapping);
            if (index > -1) {
                mappings.splice(index, 1);
            }
        }

        this.updateMappingStructure();
    }

    removeOptionMapping(paramIndex: number, optionIndex: number): void {
        if (!this.selectedDataElement?.optionSet?.options || !this.selectedDataParams[paramIndex]?.mappings) return;

        const optionCode = this.selectedDataElement.optionSet.options[optionIndex].code;
        const mappings = this.selectedDataParams[paramIndex].mappings!;
        const mappingIndex = mappings.findIndex(m => m.outputCode === optionCode);

        if (mappingIndex > -1) {
            mappings.splice(mappingIndex, 1);
            this.updateMappingStructure();
        }
    }

    loadExistingMapping(): void {
        if (!this.selectedDataElement || !this.programId || !this.instanceId) return;

        this.programManagementService
            .getExistingProgramMapping(this.selectedDataElement.id, this.programId, this.instanceId)
            .subscribe({
                next: (data: any) => {
                    if (!data || data.uuid === null) return;

                    this.mappingUuid = data.uuid;

                    const mappingData = data.value || data.mapping || data;

                    if (mappingData) {
                        if (mappingData.dataParams?.length > 0) {
                            this.selectedDataParams = mappingData.dataParams;
                        }

                        if (mappingData.junctionOperator) {
                            this.junctionOperator = mappingData.junctionOperator;
                        }

                        if (mappingData.customScript) {
                            this.customScript = mappingData.customScript;
                        }

                        this.updateMappingStructure();
                    }
                },
                error: (error: any) => {
                    this.mappingUuid = undefined;
                }
            });
    }

    createMappingPayload(): any {
        if (!this.currentMapping) return null;

        const payload = {
            uuid: this.mappingUuid,
            dataKey: this.currentMapping.dataKey,
            mapping: {
                dataElement: this.currentMapping.mapping.dataElement,
                dataParams: this.selectedDataParams,
                junctionOperator: this.junctionOperator,
                customScript: this.customScript && this.customScript.trim() ? this.customScript : undefined
            },
            namespace: this.currentMapping.namespace,
            description: this.currentMapping.description || `Mapping for ${this.selectedDataElement?.displayName}`,
            group: this.currentMapping.group,
            programId: this.programId,
            instanceId: this.instanceId
        };
        return payload;
    }

    toggleOptionMappings(paramIndex: number): void {
        if (this.selectedDataParams[paramIndex]) {
            this.selectedDataParams[paramIndex].showOptionMappings = !this.selectedDataParams[paramIndex].showOptionMappings;
        }
    }

    saveMapping(): void {
        if (!this.currentMapping) return;

        this.isSubmittingMapping = true;
        const payLoad = this.createMappingPayload();

        if (!payLoad) {
            this.isSubmittingMapping = false;
            this.showAlert('error', 'Failed to create mapping payload');
            return;
        }

        let action$;
        if (this.mappingUuid) {
            action$ = this.programManagementService.updateProgramMapping(payLoad, this.mappingUuid);
        } else {
            action$ = this.programManagementService.addProgramMapping(payLoad);
        }

        action$.subscribe({
            next: (data: any) => {
                this.isSubmittingMapping = false;
                this.mappingUuid = data.uuid || this.mappingUuid;
                this.showAlert('success', 'Program mapping saved successfully!');
            },
            error: (error: any) => {
                this.isSubmittingMapping = false;
                this.showAlert('error', error?.message || 'Failed to save mapping');
                console.error('Error saving mapping:', error);
            }
        });
    }

    deleteMapping(): void {
        if (!this.mappingUuid) return;

        this.isDeletingMapping = true;
        this.programManagementService.deleteProgramMapping(this.mappingUuid).subscribe({
            next: (data: any) => {
                this.isDeletingMapping = false;
                this.mappingUuid = undefined;
                this.showAlert('success', 'Program mapping deleted successfully!');

                // Clear the mapping data
                this.selectedDataParams = [];
                this.customScript = '';
                this.junctionOperator = '';
                this.updateMappingStructure();
            },
            error: (error: any) => {
                this.isDeletingMapping = false;
                this.showAlert('error', error?.message || 'Failed to delete mapping');
                console.error('Error deleting mapping:', error);
            }
        });
    }

    showAlert(type: 'success' | 'info' | 'error' | 'warning', message: string): void {
        this.alert = { show: true, type, message };
        setTimeout(() => this.onCloseAlert(), 5000);
    }

    onCloseAlert(): void {
        this.alert = {
            show: false,
            type: '',
            message: '',
        };
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
        this.mappingUuid = undefined;
        this.junctionOperator = '';
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
