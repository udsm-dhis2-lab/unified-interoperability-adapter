export class Dataset {
  createdBy!: string;
  code!: string;
  displayName!: string;
  periodType!: string;
  createdOn!: string;
  expiryDays!: string;

  static fromJson(json: any): Dataset {
    let dataset = new Dataset();
    dataset = json['createdBy'] ?? '';
    dataset = json['code'] ?? '';
    dataset = json['displayName'] ?? '';
    dataset = json['periodType'] ?? '';
    dataset = json['createdOn'] ?? '';
    dataset = json['expiryDays'] ?? '';
    return dataset;
  }
}
