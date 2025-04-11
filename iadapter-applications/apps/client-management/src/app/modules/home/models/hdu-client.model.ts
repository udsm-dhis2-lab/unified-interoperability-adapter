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
  dummyNida!: string;

  generateRandomId(inputDate: string): string {
      /**
       * Generate a random ID in the format YYYYMMDD-RRRRR-NNNNNNN based on an input date.
       *
       * @param inputDate - Date in 'YYYY-MM-DD' format
       * @returns Random ID in the specified format
       * @throws Error if date format is invalid
       */

      // Validate and parse the input date
      const dateParts = inputDate.split('-');
      if (dateParts.length !== 3 ||
          dateParts[0].length !== 4 ||
          dateParts[1].length !== 2 ||
          dateParts[2].length !== 2) {
          throw new Error("Invalid date format. Please use 'YYYY-MM-DD' format.");
      }

      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JS
      const day = parseInt(dateParts[2], 10);

      const dateObj = new Date(year, month, day);
      if (isNaN(dateObj.getTime())) {
          throw new Error("Invalid date.");
      }

      // Format date as YYYYMMDD
      const formattedDate = `${dateParts[0]}${dateParts[1]}${dateParts[2]}`;

      // Generate random parts
      const randomPart = Math.floor(10000 + Math.random() * 90000).toString(); // 5 digits
      const sequencePart = Math.floor(Math.random() * 10000000).toString().padStart(7, '0'); // 7 digits with leading zeros

      // Combine all parts
      return `${formattedDate}-${randomPart}-${sequencePart}`;
  }
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
    hduClient.dummyNida = hduClient.generateRandomId(json['dateOfBirth']);

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
