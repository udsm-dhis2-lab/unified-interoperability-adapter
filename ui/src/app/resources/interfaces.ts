export interface SourceInterface {
    id?: number;
    type?: string;
    url?: string;
    username?: string;
    password?: string;
}

export interface InstanceInterface {
    id?: number;
    name: string;
    url: string;
    username: string;
    password: string;
}

export interface DatasetInterface {
    id?: string;
    displayName: string;
    instances: {
        id?: number;
    } 
    formdesignCode?: Text;
}

export interface InstanceDatasetsInterface {
    id?: string;
    displayName: string;
    instanceId: string;
    formDesign?: string;
}

export interface DataValueFetchInterface{
    dataElementCategoryOptionCombo?: string;
    sqlQuery?: string;
    datasets: {
        id?: string;
    };
    datasource: {
        id?: number;
        type?: string;
        url?: string;
        username?: string;
        password?: string;
    };
}