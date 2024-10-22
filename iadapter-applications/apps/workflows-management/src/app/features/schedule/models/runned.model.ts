/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ExecutedScheduleTask {
    name: string;
    logs: Log[];
    createdBy: CreatedBy;
    code: any;
    description: any;
    ended: any;
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
    code: any;
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
    code: any;
    created: string;
    updated: string;
    name: string;
    system: boolean;
    authorities: Authority[];
}

export interface Authority {
    id: string;
    code: any;
    created: string;
    updated: string;
    system: boolean;
    name: string;
    value: string;
    description: any;
}
