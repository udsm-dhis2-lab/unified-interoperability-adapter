export interface System {
    id?: string;
    code: string;
    name: string;
    allowed: boolean;
    mediatorConfigured: boolean;
    params?: any;
    created?: string;
    updated?: string;
    switchLoading?: boolean; // UI state for switch loading
}

export interface MediatorAPI {
    id?: string;
    active: boolean;
    api: string;
    category: string;
}

export interface MediatorConfig {
    baseUrl: string;
    path?: string;
    authType: string;
    authToken?: string;
    category?: string;
    apis?: MediatorAPI[];
}

export interface FacilityRegistration {
    code: string;
    name: string;
    allowed?: boolean;
    type?: string;
    ownership?: string;
    region?: string;
    district?: string;
    status?: string;
    params?: any;
    mediatorConfig?: MediatorConfig;
}

export interface FacilityResponse {
    id?: string;
    code: string;
    name: string;
    allowed: boolean;
    type?: string;
    ownership?: string;
    region?: string;
    district?: string;
    status?: string;
    params?: any;
    created?: string;
    updated?: string;
    mediatorConfigured: boolean;
    mediatorUuid?: string;
    mediatorBaseUrl?: string;
    mediatorPath?: string;
    mediatorAuthType?: string;
    mediatorCategory?: string;
    referralEnabled?: boolean;
    referralEndpoint?: string;
}

export interface FacilityListResponse {
    facilities: System[];
    pager: {
        page: number;
        pageSize: number;
        total: number;
    };
}
