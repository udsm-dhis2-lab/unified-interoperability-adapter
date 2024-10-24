export class HduClient {
  clientID!: string;
  fname!: string;
  mname!: string;
  surname!: string;
  gender!: string;
  idNumber!: string;
  idType!: string;
  dateOfBirth!: string;

  static fromJson(json: any): HduClient {
    const hduClient = new HduClient();
    hduClient.clientID = json['clientID'];
    hduClient.fname = json['firstName'];
    hduClient.mname = json['middleName'];
    hduClient.surname = json['lastName'];
    hduClient.gender = json['gender'];
    hduClient.dateOfBirth = json['dateOfBirth'];
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
