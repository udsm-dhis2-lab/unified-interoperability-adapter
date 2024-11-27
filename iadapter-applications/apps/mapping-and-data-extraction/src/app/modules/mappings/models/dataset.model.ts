export class Dataset {
  id!: string;
  code!: string;
  displayName!: string;
  periodType!: string;
  expiryDays!: string;
  formType!: string;
  name!: string;
  uuid!: string;
  datasetFields!: string;
  selected!: boolean;
  dataSetInstance?: DataSetInstance;

  static fromJson(json: any): Dataset {
    let dataset = new Dataset();
    dataset.id = json['id'] ?? json['datasetFields']['id'];
    dataset.name = json['name'];
    dataset.uuid = json['uuid'] ?? '';
    dataset.code = json['code'] ?? '';
    dataset.displayName =
      json['displayName'] ??
      (json['formType'] === 'CUSTOM'
        ? json['datasetFields']['dataEntryForm']['name']
        : json['datasetFields']['displayName'] ?? '');
    dataset.periodType = json['periodType'] ?? '';
    dataset.formType = json['formType'] ?? '';
    dataset.expiryDays = json['expiryDays'] ?? '';
    dataset.datasetFields = json['datasetFields'] ?? '';
    dataset.selected = json['selected'] ?? false;
    dataset.dataSetInstance = json['dataSetInstance']
      ? DataSetInstance.fromJson(json['dataSetInstance'])
      : undefined;
    return dataset;
  }
}

export class DataSetInstance {
  name?: string;
  uuid!: string;

  static fromJson(json: any): DataSetInstance {
    let instance = new DataSetInstance();
    instance.uuid = json['uuid'] ?? '';
    instance.name = json['name'];
    return instance;
  }
}
