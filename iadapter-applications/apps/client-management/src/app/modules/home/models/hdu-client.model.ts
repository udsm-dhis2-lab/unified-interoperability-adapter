export class HduClient {
  clientID!: string;
  fname!: string;
  mname!: string;
  surname!: string;
  fullName!: string;
  gender!: string;
  idNumber!: string;
  idType!: string;
  dateOfBirth!: string;
  phoneNumbers!: string;
  emails!: string;
  addresses!: any;
  occupation!: string;
  nationality!: string;
  nida!: string;
  identifiers!: any;

  static fromJson(json: any): HduClient {
    const hduClient = new HduClient();
    hduClient.clientID = json['id'];
    hduClient.fullName = `${json['firstName'] || ''} ${json['middleName'] || ''} ${json['lastName'] || ''}`;
    hduClient.fname = json['firstName'];
    hduClient.mname = json['middleName'];
    hduClient.surname = json['lastName'];
    hduClient.gender = json['gender'];
    hduClient.dateOfBirth = json['dateOfBirth'];
    hduClient.phoneNumbers = json['phoneNumbers'];
    hduClient.emails = json['emails'];
    hduClient.addresses = json['addresses'];
    hduClient.occupation = json['occupation'];
    hduClient.nationality = json['nationality'];
    hduClient.identifiers = json['identifiers'];
    hduClient.nida = json['identifiers'].filter((id: any) => id['type'] === 'NIDA').map((id: any)=> id['id']);
    hduClient.idNumber = json['identifiers'][0]
      ? json['identifiers'][0]['id']
      : '';
    hduClient.idType = json['identifiers'][0]
      ? json['identifiers'][0]['type']
      : '';
    return hduClient;
  }
}

export class HDUAPIClientDetails {
  demographicDetails!: HduClient;
  facilityDetails!: {
    code: string;
    name: string;
  };

  static fromJson(json: any): HDUAPIClientDetails {
    const hduClient = new HDUAPIClientDetails();
    hduClient.demographicDetails = HduClient.fromJson(
      json['demographicDetails']
    );
    hduClient.facilityDetails = {
      code: json['facilityDetails']['code'],
      name: json['facilityDetails']['name'],
    };
    return hduClient;
  }
}
