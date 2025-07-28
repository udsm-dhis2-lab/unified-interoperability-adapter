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

export interface DataTemplateField {
    code: string;
    type: string;
    block: string;
    label: string;
    path: string;
}

export interface TreeNode {
    key: string;
    title: string;
    label: string;
    value?: any;
    children?: TreeNode[];
    path: string;
    type: string;
    isLeaf: boolean;
    selectable: boolean;
    expanded?: boolean;
    selected?: boolean;
    icon?: string;
}

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
        path: string;
        type: string;
        label: string;
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
    programTrackedEntityAttributes?: ProgramTrackedEntityAttribute[];
}

export interface ProgramTrackedEntityAttribute {
    trackedEntityAttribute: TrackedEntityAttribute;
}

export interface TrackedEntityAttribute {
    displayName: string;
    formName?: string;
    name?: string;
    id: string;
    selected?: boolean;
    optionSet?: OptionSet;
    type?: string;
    code?: string;
}

@Component({
    selector: 'app-program-mapping',
    standalone: true,
    imports: [SharedModule, FormsModule, CodeEditorComponent],
    templateUrl: './program-mapping.component.html',
    styleUrl: './program-mapping.component.css',
})
export class ProgramMappingComponent implements OnInit {
    // Component state
    isLoading = false;
    isLoadingDataTemplate = false;
    leftColumnSpan = 12;
    rightColumnSpan = 12;
    hasError = false;
    errorMessage = '';

    // Program data
    programData: ProgramData | null = null;
    programId: string = '';
    instanceId: string = '';
    selectedDataElement: DataElement | null = null;
    selectedTrackedEntityAttribute: TrackedEntityAttribute | null = null;

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

    // Data template tree for tree selector
    dataTemplateTree: TreeNode[] = [];
    dataTemplateRaw: any = null;

    // Tree selector state
    selectedTreeNodes: TreeNode[] = [];
    expandedKeys: string[] = [];
    searchValue: string = '';

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
                this.loadDataTemplateFields();
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

    loadDataTemplateFields(): void {
        this.isLoadingDataTemplate = true;

        this.programManagementService.getDataTemplate()
            .subscribe({
                next: (data) => {
                    console.log('Data template response:', data);

                    this.dataTemplateRaw = data;

                    this.dataTemplateTree = this.createTreeFromTemplate(data);

                    this.isLoadingDataTemplate = false;
                    console.log('Loaded data template tree:', this.dataTemplateTree);
                },
                error: (error) => {
                    console.error('Error loading data template fields:', error);
                    this.isLoadingDataTemplate = false;

                    this.showAlert('warning', 'Using default data template fields due to loading error');
                }
            });
    }

    private createTreeFromTemplate(template: any): TreeNode[] {
        if (!template) return [];

        return this.createTreeNodes(template, '', 'root');
    }

    private createTreeNodes(obj: any, currentPath: string, parentKey: string): TreeNode[] {
        const nodes: TreeNode[] = [];

        if (obj === null || obj === undefined) {
            return nodes;
        }

        if (Array.isArray(obj)) {
            const arrayLabel = `${this.createFieldLabel(parentKey)} (Array)`;
            nodes.push({
                key: `${parentKey}[]`,
                title: arrayLabel,
                label: arrayLabel,
                value: obj,
                path: currentPath,
                type: 'ARRAY',
                isLeaf: false,
                selectable: true,
                children: obj.length > 0 ? this.createTreeNodes(obj[0], `${currentPath}[0]`, `${parentKey}[0]`) : [],
                icon: this.getNodeIcon('ARRAY', false)
            });

            return nodes;
        }

        if (typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                const value = obj[key];
                const newPath = currentPath ? `${currentPath}.${key}` : key;
                const nodeKey = currentPath ? `${currentPath}.${key}` : key;

                let nodeType = 'OBJECT';
                let isLeaf = false;
                let children: TreeNode[] = [];

                if (value === null || value === undefined) {
                    nodeType = 'NULL';
                    isLeaf = true;
                } else if (typeof value === 'string') {
                    nodeType = this.determineStringType(key, value);
                    isLeaf = true;
                } else if (typeof value === 'number') {
                    nodeType = 'NUMBER';
                    isLeaf = true;
                } else if (typeof value === 'boolean') {
                    nodeType = 'BOOLEAN';
                    isLeaf = true;
                } else if (Array.isArray(value)) {
                    nodeType = 'ARRAY';
                    isLeaf = false;
                    children = this.createTreeNodes(value, newPath, key);
                } else if (typeof value === 'object') {
                    nodeType = 'OBJECT';
                    isLeaf = false;
                    children = this.createTreeNodes(value, newPath, key);
                }

                const fieldLabel = this.createFieldLabel(key);
                nodes.push({
                    key: nodeKey,
                    title: fieldLabel,
                    label: fieldLabel,
                    value: value,
                    path: newPath,
                    type: nodeType,
                    isLeaf: isLeaf,
                    selectable: true,
                    children: children,
                    icon: this.getNodeIcon(nodeType, isLeaf)
                });
            });
        }

        return nodes;
    }

    private determineStringType(key: string, value: string): string {
        const keyLower = key.toLowerCase();

        if (keyLower.includes('date')) {
            if (keyLower.includes('time') || /T\d{2}:\d{2}:\d{2}/.test(value)) {
                return 'DATETIME';
            }
            return 'DATE';
        }

        if (keyLower.includes('time')) {
            return 'DATETIME';
        }

        // Check if value looks like a date
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
            return /T\d{2}:\d{2}:\d{2}/.test(value) ? 'DATETIME' : 'DATE';
        }

        return 'TEXT';
    }

    onTreeClick(event: any, paramIndex: number): void {
        const node = event.node?.origin as TreeNode;
        if (node && node.selectable) {
            console.log('Tree node clicked for param:', { paramIndex, node });
            this.selectNodeForDataParam(paramIndex, node);
        }
    }

    onTreeExpandChange(event: any): void {
        const node = event.node?.origin as TreeNode;
        if (node) {
            if (event.isExpanded) {
                if (!this.expandedKeys.includes(node.key)) {
                    this.expandedKeys.push(node.key);
                }
            } else {
                const index = this.expandedKeys.indexOf(node.key);
                if (index > -1) {
                    this.expandedKeys.splice(index, 1);
                }
            }
        }
    }

    selectNodeForDataParam(index: number, selectedNode: TreeNode): void {
        if (!selectedNode || !selectedNode.selectable || !this.selectedDataParams[index]) {
            console.log('Node not selectable or invalid index:', { selectedNode, index });
            return;
        }

        console.log('Selecting node for data param:', { index, selectedNode });

        this.selectedDataParams[index].value = {
            path: selectedNode.path,
            type: selectedNode.type,
            label: selectedNode.label
        };
        this.updateMappingStructure();
    }

    onTreeSearchValueChange(searchValue: string): void {
        this.searchValue = searchValue;
        if (searchValue) {
            this.expandNodesWithSearchTerm(this.dataTemplateTree, searchValue.toLowerCase());
        }
    }

    private expandNodesWithSearchTerm(nodes: TreeNode[], searchTerm: string): void {
        nodes.forEach(node => {
            if (node.label.toLowerCase().includes(searchTerm)) {
                if (!this.expandedKeys.includes(node.key)) {
                    this.expandedKeys.push(node.key);
                }
            }
            if (node.children) {
                this.expandNodesWithSearchTerm(node.children, searchTerm);
            }
        });
    }

    // Tree node selection for updating data params
    onTreeNodeClick(event: any, paramIndex: number): void {
        const node = event.node?.origin as TreeNode;
        if (node && node.selectable && node.isLeaf) {
            this.selectNodeForDataParam(paramIndex, node);
        }
    }

    private createFieldLabel(key: string): string {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    getNodeIcon(nodeType: string, isLeaf: boolean): string {
        if (!isLeaf) {
            return nodeType === 'ARRAY' ? 'unordered-list' : 'folder';
        }

        switch (nodeType) {
            case 'TEXT': return 'font-colors';
            case 'NUMBER': return 'field-number';
            case 'BOOLEAN': return 'check-square';
            case 'DATE': return 'calendar';
            case 'DATETIME': return 'clock-circle';
            case 'NULL': return 'minus-circle';
            default: return 'file-text';
        }
    }

    onDataElementSelect(dataElement: DataElement): void {
        // Clear any selected tracked entity attribute
        if (this.selectedTrackedEntityAttribute) {
            this.selectedTrackedEntityAttribute.selected = false;
            this.selectedTrackedEntityAttribute = null;
        }

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

    onTrackedEntityAttributeSelect(attribute: TrackedEntityAttribute): void {
        // Clear any selected data element
        if (this.selectedDataElement) {
            this.selectedDataElement.selected = false;
            this.selectedDataElement = null;
        }

        // Deselect previously selected attribute
        if (this.selectedTrackedEntityAttribute && this.selectedTrackedEntityAttribute.id !== attribute.id) {
            this.selectedTrackedEntityAttribute.selected = false;
        }

        // Toggle selection
        attribute.selected = !attribute.selected;
        this.selectedTrackedEntityAttribute = attribute.selected ? attribute : null;

        // Initialize mapping when attribute is selected
        if (this.selectedTrackedEntityAttribute) {
            this.initializeMapping();
            this.loadExistingMapping();
        } else {
            this.currentMapping = null;
            this.mappingUuid = undefined;
        }
    }

    initializeMapping(): void {
        if (!this.selectedDataElement && !this.selectedTrackedEntityAttribute) return;

        let mappingContent: any;
        let dataKey: string;

        if (this.selectedDataElement) {
            dataKey = this.selectedDataElement.id;
            mappingContent = {
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
            };
        } else if (this.selectedTrackedEntityAttribute) {
            dataKey = this.selectedTrackedEntityAttribute.id;
            mappingContent = {
                trackedEntityAttribute: {
                    id: this.selectedTrackedEntityAttribute.id,
                    name: this.selectedTrackedEntityAttribute.displayName,
                    program: this.programId,
                    code: this.selectedTrackedEntityAttribute.code || '',
                    type: '' //TODO: Add data type
                },
                dataParams: [],
                junctionOperator: this.junctionOperator
            };
        } else {
            return;
        }

        this.currentMapping = {
            dataKey: dataKey,
            mapping: mappingContent,
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
                path: '',
                type: 'TEXT',
                label: ''
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

    updateDataParam(index: number, selectedNode: TreeNode): void {
        if (this.selectedDataParams[index]) {
            this.selectedDataParams[index].value = {
                path: selectedNode.path,
                type: selectedNode.type,
                label: selectedNode.label
            };
            this.updateMappingStructure();
        }
    }

    onDataParamFieldChange(index: number, selectedNode: TreeNode): void {
        if (selectedNode && selectedNode.selectable) {
            this.updateDataParam(index, selectedNode);
        }
    }

    findTreeNodeByPath(path: string): TreeNode | null {
        const findInNodes = (nodes: TreeNode[]): TreeNode | null => {
            for (const node of nodes) {
                if (node.path === path) {
                    return node;
                }
                if (node.children) {
                    const found = findInNodes(node.children);
                    if (found) return found;
                }
            }
            return null;
        };

        return findInNodes(this.dataTemplateTree);
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

        if (!this.selectedDataParams[paramIndex].mappings) {
            this.selectedDataParams[paramIndex].mappings = [];
        }

        const mappings = this.selectedDataParams[paramIndex].mappings!;
        let mapping = mappings.find(m => m.outputCode === optionCode);

        if (!mapping) {
            mapping = {
                inputCodes: [],
                operator: 'IN',
                outputCode: optionCode
            };
            mappings.push(mapping);
        }

        mapping.inputCodes = inputText.split(',').map(s => s.trim()).filter(s => s);

        if (mapping.inputCodes.length === 0) {
            const index = mappings.indexOf(mapping);
            if (index > -1) {
                mappings.splice(index, 1);
            }
        }

        this.updateMappingStructure();
    }

    removeOptionMapping(paramIndex: number, optionIndex: number): void {
        const optionSet = this.selectedDataElement?.optionSet || this.selectedTrackedEntityAttribute?.optionSet;
        if (!optionSet?.options || !this.selectedDataParams[paramIndex]?.mappings) return;

        const optionCode = optionSet.options[optionIndex].code;
        const mappings = this.selectedDataParams[paramIndex].mappings!;
        const mappingIndex = mappings.findIndex(m => m.outputCode === optionCode);

        if (mappingIndex > -1) {
            mappings.splice(mappingIndex, 1);
            this.updateMappingStructure();
        }
    }

    loadExistingMapping(): void {
        const elementId = this.selectedDataElement?.id || this.selectedTrackedEntityAttribute?.id;
        if (!elementId || !this.programId || !this.instanceId) return;

        this.programManagementService
            .getExistingProgramMapping(elementId, this.programId, this.instanceId)
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

        let mappingContent: any;
        let description: string;

        if (this.selectedDataElement) {
            // For data elements
            mappingContent = {
                dataElement: this.currentMapping.mapping.dataElement,
                dataParams: this.selectedDataParams,
                junctionOperator: this.junctionOperator,
                customScript: this.customScript && this.customScript.trim() ? this.customScript : undefined
            };
            description = this.currentMapping.description || `Mapping for ${this.selectedDataElement?.displayName}`;
        } else if (this.selectedTrackedEntityAttribute) {
            // For tracked entity attributes
            mappingContent = {
                trackedEntityAttribute: {
                    id: this.selectedTrackedEntityAttribute.id,
                    displayName: this.selectedTrackedEntityAttribute.displayName,
                    program: this.programId,
                    formName: this.selectedTrackedEntityAttribute.formName,
                    type: '' //TODO: Add data type
                },
                dataParams: this.selectedDataParams,
                junctionOperator: this.junctionOperator,
                customScript: this.customScript && this.customScript.trim() ? this.customScript : undefined
            };
            description = this.currentMapping.description || `Mapping for ${this.selectedTrackedEntityAttribute?.displayName}`;
        } else {
            return null;
        }

        const payload = {
            uuid: this.mappingUuid,
            dataKey: this.currentMapping.dataKey,
            mapping: mappingContent,
            namespace: this.currentMapping.namespace,
            description: description,
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
        if (this.selectedTrackedEntityAttribute) {
            this.selectedTrackedEntityAttribute.selected = false;
            this.selectedTrackedEntityAttribute = null;
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

    get isTrackerProgram(): boolean {
        return this.programData?.programType === 'WITH_REGISTRATION';
    }

    get hasEnrollmentAttributes(): boolean {
        return this.isTrackerProgram &&
            !!this.programData?.programTrackedEntityAttributes &&
            this.programData.programTrackedEntityAttributes.length > 0;
    }

    get isDataTemplateLoaded(): boolean {
        return this.dataTemplateTree.length > 0;
    }

    get dataTemplateLoadingStatus(): string {
        if (this.isLoadingDataTemplate) {
            return 'Loading data template...';
        }
        if (this.dataTemplateTree.length === 0) {
            return 'No data template available';
        }

        const selectableCount = this.countSelectableNodes(this.dataTemplateTree);
        return `Data template loaded with ${selectableCount} selectable fields`;
    }

    private countSelectableNodes(nodes: TreeNode[]): number {
        let count = 0;
        for (const node of nodes) {
            if (node.isLeaf && node.selectable) {
                count++;
            }
            if (node.children) {
                count += this.countSelectableNodes(node.children);
            }
        }
        return count;
    }

    // Helper method to get the display text for a selected data param
    getDataParamDisplayText(dataParam: DataParam): string {
        if (!dataParam.value.label && dataParam.value.path) {
            const node = this.findTreeNodeByPath(dataParam.value.path);
            return node ? node.label : dataParam.value.path;
        }
        return dataParam.value.label || dataParam.value.path || 'No selection';
    }

    trackBySection(index: number, section: ProgramStageSection): string {
        return section.id;
    }

    trackByDataElement(index: number, dataElement: DataElement): string {
        return dataElement.id;
    }

    trackByTrackedEntityAttribute(index: number, programAttribute: ProgramTrackedEntityAttribute): string {
        return programAttribute.trackedEntityAttribute.id;
    }
}
