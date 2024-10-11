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
    checked: boolean;
    expand: boolean
    disabled: boolean
}

export interface DeleteResponse {
    message: string;
}
