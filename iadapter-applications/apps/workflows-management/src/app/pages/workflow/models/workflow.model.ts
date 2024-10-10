export interface WorkflowNode {
    id: string;
    type: string;
    data: {
        name: string;
        icon: {
            name: string;
            color: string;
        };
        config: {
            message: string | null;
            severity: string | null;
        };
    };
    children?: WorkflowNode[];
}

export interface Workflow {
    root: WorkflowNode;
    connectors: { startStepId: string; endStepId: string }[];
}
