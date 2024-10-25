export class Deduplication {
  clientID!: string;
  fname!: string;
  mname!: string;
  surname!: string;
  gender!: string;
  idNumber!: string;
  idType!: string;
  dateOfBirth!: string;
  emails!: string;
  occupation!: string;
  nationality!: string;
  addresses!: string;
  associatedDuplicates!: number;

  static fromJson(json: any): Deduplication {
    const deduplication = new Deduplication();
    deduplication.clientID = json['clientID'];
    deduplication.fname = json['firstName'];
    deduplication.mname = json['middleName'];
    deduplication.surname = json['lastName'];
    deduplication.gender = json['gender'];
    deduplication.idNumber = json['identifiers'][0]['id'];
    deduplication.idType = json['identifiers'][0]['type'];
    deduplication.associatedDuplicates = json['associatedDuplicates'] ?? 0;
    return deduplication;
  }
}
