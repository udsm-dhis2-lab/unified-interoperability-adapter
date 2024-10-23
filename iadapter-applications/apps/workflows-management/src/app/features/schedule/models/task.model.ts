export interface TaskAPIResult {
    page: number;
    total: number;
    pageSize: number;
    tasks: Task[];
}

export interface Task {
    name: string;
    logs: Log[];
    createdBy: CreatedBy;
    code: string;
    description: string;
    ended: string;
    id: string;
    created: string;
    updated: string;
    status: string;
    started: string;
}

export interface Log {
    type: string;
    message: string;
    time: string;
    context: string;
}

export interface CreatedBy {
    id: string;
    code: string;
    created: string;
    updated: string;
    phoneNumber: string;
    lastLogin: string;
    email: string;
    username: string;
    dp: string;
    name: string;
    password: string;
    salt: string;
    active: boolean;
    roles: Role[];
}

export interface Role {
    id: string;
    code: string;
    created: string;
    updated: string;
    name: string;
    system: boolean;
    authorities: Authority[];
}

export interface Authority {
    id: string;
    code: string;
    created: string;
    updated: string;
    system: boolean;
    name: string;
    value: string;
    description: string;
}

export interface DeleteResponse {
    message: string;
}
