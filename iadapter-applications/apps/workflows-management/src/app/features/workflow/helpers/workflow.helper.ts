import { Dictionary } from '@ngrx/entity';
import { Process } from '../models/process.model';
import { RootWorkflowNode, WorkflowNode } from '../models/workflow-step.model';
import { Workflow } from '../models/workflow.model';
import { ActivatedRoute } from '@angular/router';

export function hasChildren(jsonString: string, nodeId: string): boolean {
  // Helper function to search recursively
  function searchNode(node: WorkflowNode): boolean {
    if (node.id === nodeId && node.children) {
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
  const workflow: RootWorkflowNode = JSON.parse(jsonString);

  // Start search from the root node
  return searchNode(workflow.root);
}

// export function transformWorkflowToProcessTree(
//     workflow: Workflow
// ): RootWorkflowNode {
//     return {
//         root: {
//             id: workflow.id, // Use the id from the source payload
//             type: 'log',
//             data: {
//                 name: workflow.name, // Use the name from the source payload
//                 icon: {
//                     name: 'log-icon',
//                     color: 'blue',
//                 },
//                 config: {
//                     message: null,
//                     severity: null,
//                 },
//             },
//             children: [

//             ], // Initialize an empty children array
//         },
//     };
// }

export function transformWorkflowToProcessTree(
  workflow: Workflow
): RootWorkflowNode {
  // Check if the workflow contains a process
  const process = workflow.process
    ? {
        id: workflow.process.id, // Use the id from the process payload
        type: 'log',
        isRoot: false,
        data: {
          name: workflow?.process?.name, // Use the name from the process payload
          icon: {
            name: 'log-icon',
            color: 'blue',
          },
          config: {
            message: null,
            severity: null,
          },
        },
        children: [], // Optionally, process can have its own children
      }
    : null;

  return {
    root: {
      id: workflow.id, // Use the id from the source payload
      type: 'log',
      isRoot: true,
      data: {
        name: workflow.name, // Use the name from the source payload
        icon: {
          name: 'log-icon',
          color: 'blue',
        },
        config: {
          message: null,
          severity: null,
        },
      },
      children: process ? [process as WorkflowNode] : [], // Add the process if it exists
    },
  };
}

export function isRootNode(rootWorkflowNode: RootWorkflowNode): boolean {
  // Check if the given nodeId is the root node
  // if (rootWorkflowNode.root.id === nodeId) {
  //     return true;
  // }

  // If the node is not the root, return false
  return rootWorkflowNode.root.isRoot;
}

export function filterPayload(workflow: Workflow): {
  id: string;
  name: string;
  description: string;
} {
  // Destructure the needed fields from the payload
  const { id, name, description } = workflow;

  // Return only the required fields
  return { id, name, description };
}

// Improved TypeScript function to search for a process by ID
export function searchProcessWithWorkflows(
  payload: Dictionary<Workflow>,
  id: string
): Process | null {
  // Iterate through all workflows in the payload
  for (const workflowKey in payload) {
    const workflow = payload[workflowKey];

    // Check if the workflow has a process and if the process id matches the given id
    if (workflow?.process?.id === id) {
      return workflow.process;
    }
  }

  // If no matching process is found, return null
  return null;
}

// Helper function to get 'id' from the current route
export function getUidFromRoute(route: ActivatedRoute): string | null {
  return route.snapshot.paramMap.get('id');
}

export function extractUidFromUrl(url: string): string | null {
  // Using a regular expression to match the UID pattern (UUID)
  const uidPattern = /\/([^/]+)$/; // Match the last segment of the path without escaping

  const match = url.match(uidPattern);
  return match ? match[1] : null; // Return the UID if found, otherwise null
}

export function toCamelCase(word: string) {
  return word
    .toLowerCase() // Convert the entire sentence to lowercase
    .split(' ') // Split the sentence into words by spaces
    .map((word, index) => {
      // Iterate through each word
      if (index === 0) {
        return word; // First word remains in lowercase
      }
      // Capitalize the first letter of each word except the first one
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(''); // Join the words back together with no spaces
}

export function extractIdFromPath(url: string): string {
  const parts = url.split('/');
  return parts.pop() || '';
}
