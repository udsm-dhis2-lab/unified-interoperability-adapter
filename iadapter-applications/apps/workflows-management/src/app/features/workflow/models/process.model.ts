export interface ProcessAPIResult {
  page: number;
  total: number;
  pageSize: number;
  processs: Process[];
}

export interface Process {
  id: string;
  created?: string;
  updated?: string;
  code?: string;
  adaptors?: string[];
  name?: string;
  description?: string;
  script?: string;
  parameters?: any;
  status?: string;
  parent?: Process;
  children?: Process[]
}

export interface ProcessTable {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  checked: boolean;
  expand: boolean;
  disabled: boolean;
}

export interface ProcessFormCreate {
  name: string;
  description: string;
}

export interface DeleteResponse {
  message: string;
}

export interface ProcessCheckboxOption {
  label: string;
  value: string;
  checked: boolean;
}
