import { Process } from './process.model';

export interface WorkflowAPIResult {
    page: number;
    total: number;
    pageSize: number;
    workflows: Workflow[];
}

export interface Workflow {
    id: string;
    created: string;
    updated: string;
    name: string;
    description: string;
    createdBy?: CreatedBy;
    updatedBy?: UpdatedBy;
    process?: Process;
}

export interface WorkflowTable {
    id: string;
    created: string;
    updated: string;
    name: string;
    description: string;
    checked: boolean;
    expand: boolean;
    disabled: boolean;
    process: Process
}

export interface WorkflowFormCreate {
    name: string;
    description: string;
}

export interface DeleteResponse {
    message: string;
}

export interface CreatedBy {
    id: string;
    created: string;
    updated: string;
    lastLogin: string;
    username: string;
    dp: string;
    name: string;
    active: boolean;
}

export interface UpdatedBy {
    id: string;
    created: string;
    updated: string;
    lastLogin: string;
    username: string;
    dp: string;
    name: string;
    active: boolean;
}
