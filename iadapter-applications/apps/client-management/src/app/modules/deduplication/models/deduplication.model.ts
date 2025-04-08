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
  keys!: string[];

  static fromJson(json: any): Deduplication {
    const deduplication = new Deduplication();
    try {
      deduplication.clientID = json['clientID'] ?? '';
      deduplication.fname = json['name'];
      deduplication.mname = json['middleName'] ?? '';
      deduplication.surname = json['lastName'] ?? '';
      deduplication.gender = json['gender'] ?? '';
      deduplication.idNumber = json['types'][0];
      deduplication.idType = json['types'][0];
      deduplication.dateOfBirth = json['dateOfBirth'] ?? '';
      deduplication.occupation = json['occupation'] ?? '';
      deduplication.nationality = json['nationality'] ?? '';
      deduplication.emails = json['emails'] ?? '';
      deduplication.addresses = json['addresses'] ?? '';
      deduplication.associatedDuplicates = json['total'] ?? 0;
      return { ...deduplication, ...json };
    } catch (e) {
      console.log(e);
      return { ...json };
    }
  }
}
