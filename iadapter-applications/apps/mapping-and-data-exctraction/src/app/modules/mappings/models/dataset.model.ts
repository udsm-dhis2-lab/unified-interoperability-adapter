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

  static fromJson(json: any): Dataset {
    let dataset = new Dataset();
    dataset.id = json['id'] ?? '';
    dataset.name = json['name'];
    dataset.uuid = json['uuid'] ?? '';
    dataset.code = json['code'] ?? '';
    dataset.displayName = json['displayName'];
    dataset.periodType = json['periodType'] ?? '';
    dataset.formType = json['formType'] ?? '';
    dataset.expiryDays = json['expiryDays'] ?? '';
    dataset.datasetFields = json['datasetFields'] ?? '';
    return dataset;
  }
}
