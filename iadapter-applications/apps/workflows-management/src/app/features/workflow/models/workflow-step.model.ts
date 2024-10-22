export interface WorkflowNode {
    id: string;
    type: string;
    isRoot: boolean;
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
    children?: WorkflowNode[] | null;
}

export interface RootWorkflowNode {
    root: WorkflowNode;
    connectors?: { startStepId: string; endStepId: string }[];
}
