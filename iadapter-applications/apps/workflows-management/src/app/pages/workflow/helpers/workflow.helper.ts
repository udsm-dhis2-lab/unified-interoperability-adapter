import { Workflow, WorkflowNode } from '../models/workflow.model';

export function hasChildren(jsonString: string, nodeId: string): boolean {
    // Helper function to search recursively
    function searchNode(node: WorkflowNode): boolean {
        if (node.id === nodeId) {
            return node.children !== undefined && node.children.length > 0;
        }

        // Traverse through children if present
        if (node.children) {
            for (const child of node.children) {
                const found = searchNode(child);
                if (found) {
                    return true;
                }
            }
        }
        return false;
    }

    // Parse the JSON string
    const workflow: Workflow = JSON.parse(jsonString);

    // Start search from the root node
    return searchNode(workflow.root);
}
