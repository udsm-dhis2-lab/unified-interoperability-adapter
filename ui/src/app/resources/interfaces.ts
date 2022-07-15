export interface SourceInterface {
    id?: number;
    type: string;
    url: string;
    username: string;
    password: string;
}

export interface InstanceInterface {
    id?: number;
    // name: string;
    url: string;
    username: string;
    password: string;
}

export interface DatasetInterface {
    id?: string;
    name: string;
    instanceId?: number;
    formDesign?: string;
}

export interface InstanceDatasetsInterface {
    id?: string;
    name: string;
    instanceUrl: string;
    formDesign?: string;
}

export interface DataValueFetchInterface{
    dataElementCombo?: string;
    query?: string;
    dataset: {
        id?: string;
    };
    source: {
        id?: number;
    };
}