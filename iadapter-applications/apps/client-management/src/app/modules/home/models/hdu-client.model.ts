export class HduClient {
  clientID!: string;
  fname!: string;
  mname!: string;
  surname!: string;
  gender!: string;
  idNumber!: string;
  idType!: string;

  static fromJson(json: any): HduClient {
    const hduClient = new HduClient();
    hduClient.clientID = json['clientID'];
    hduClient.fname = json['firstName'];
    hduClient.mname = json['middleName'];
    hduClient.surname = json['lastName'];
    hduClient.gender = json['gender'];
    hduClient.idNumber = json['identifiers'][0]['id'];
    hduClient.idType = json['identifiers'][0]['type'];
    return hduClient;
  }
}
