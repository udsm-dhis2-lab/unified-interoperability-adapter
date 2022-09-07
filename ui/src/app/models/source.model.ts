export interface QueryData {
  sources?: SourceInterface[];
  source?: SourceInterface;
  query?: string;
  dataset?: DatasetInterface;
}

export interface SourceInterface {
  id?: number;
  type?: string;
  url?: string;
  username?: string;
  password?: string;
}

export interface DatasetInterface {
  id?: string;
  displayName: string;
  instances: {
    id?: number;
  };
  formDesignCode?: string;
  periodType?: string;
}