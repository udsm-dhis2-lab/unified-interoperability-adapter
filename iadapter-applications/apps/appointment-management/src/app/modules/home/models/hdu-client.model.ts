export class HduClient {
  clientID!: string;
  fname!: string;
  mname!: string;
  surname!: string;
  gender!: string;
  idNumber!: string;
  idType!: string;
  dateOfBirth!: string;
  phoneNumbers!: string; // Consider making this an array if multiple numbers are common
  emails!: string; // Consider making this an array if multiple emails are common
  addresses!: any; // Consider making this an array of address objects
  occupation!: string;
  nationality!: string;

  // Optional properties based on the JSON data
  maritalStatus?: string;
  contactPeople?: {
    firstName?: string;
    lastName?: string;
    phoneNumbers?: string[];
    relationShip?: string;
  }[];
  identifiers?: {
    type: string;
    id: string;
    preferred?: boolean;
  }[];
  paymentDetails?: any; // Placeholder for complex payment data
  relatedClients?: any[]; // Placeholder for related client references
  appointment?: any[]

  static fromJson(json: any): HduClient {
    const hduClient = new HduClient();
    hduClient.clientID = json['clientID'] || json['id'] || '';
    hduClient.fname = json['firstName'] || '';
    hduClient.mname = json['middleName'] || '';
    hduClient.surname = json['lastName'] || '';
    hduClient.gender = json['gender'] || '';
    hduClient.dateOfBirth = json['dateOfBirth'] || '';
    hduClient.phoneNumbers = json['phoneNumbers'] ? json['phoneNumbers'].join(', ') : '';
    hduClient.emails = json['emails'] ? json['emails'].join(', ') : '';
    hduClient.addresses = json['addresses'] ? json['addresses'] : '';
    hduClient.occupation = json['occupation'] || '';
    hduClient.nationality = json['nationality'] || '';
    hduClient.maritalStatus = json['maritalStatus'];
    hduClient.contactPeople = json['contactPeople'] || [];
    hduClient.identifiers = json['identifiers'] || [];
    hduClient.paymentDetails = json['paymentDetails'];
    hduClient.relatedClients = json['relatedClients'] || [];
    hduClient.appointment = json['appointment'] || [];

    // Handle identifiers for idNumber and idType
    hduClient.idNumber = json['identifiers'] && json['identifiers'][0] ? json['identifiers'][0]['id'] : '';
    hduClient.idType = json['identifiers'] && json['identifiers'][0] ? json['identifiers'][0]['type'] : '';

    return hduClient;
  }
}

export class HDUAPIClientDetails {
  demographicDetails!: HduClient;
  facilityDetails!: {
    code: string;
    name: string;
  };

  // Optional properties based on the JSON data
  reportingDetails?: any; // Placeholder for reporting data
  mrn?: string;
  visitDetails?: {
    id?: string;
    visitDate?: string;
    newThisYear?: boolean;
    closedDate?: string;
    visitType?: string;
    careServices?: any[];
    new?: boolean;
  };
  clinicalInformation?: {
    vitalSigns?: {
      bloodPressure?: string;
      dateTime?: string;
      weight?: string;
      temperature?: string;
      height?: string;
      respiration?: string;
      pulseRate?: string;
    }[];
    visitNotes?: {
      date?: string;
      chiefComplaints?: any[];
      historyOfPresentIllness?: any[];
      reviewOfOtherSystems?: any[];
      pastMedicalHistory?: any[];
      familyAndSocialHistory?: any[];
      generalExaminationObservation?: any[];
      localExamination?: any[];
      systemicExaminationObservation?: any[];
      doctorPlanOrSuggestion?: any[];
      providerSpeciality?: string;
    }[];
  };
  allergies?: any[];
  chronicConditions?: {
    code?: string;
    category?: string;
    name?: string;
    criticality?: string;
    verificationStatus?: string;
  }[];
  lifeStyleInformation?: {
    smoking?: { use?: boolean; notes?: string };
    alcoholUse?: { use?: boolean; notes?: string };
    drugUse?: { use?: boolean; notes?: string };
  };
  investigationDetails?: any[];
  labInvestigationDetails?: any[];
  diagnosisDetails?: any[];
  medicationDetails?: any;
  treatmentDetails?: {
    chemoTherapy?: any;
    radioTherapy?: any;
    palliativeCare?: any;
    surgery?: any;
    hormoneTherapy?: any;
    symptomatic?: any;
    alternativeTreatment?: any;
    medicalProcedureDetails?: any;
  };
  radiologyDetails?: any;
  admissionDetails?: any;
  outcomeDetails?: {
    isAlive?: boolean;
    deathLocation?: string;
    deathDate?: string;
    contactTracing?: any;
    investigationConducted?: any;
    quarantined?: any;
    referred?: boolean;
  };
  causesOfDeathDetails?: any;
  antenatalCareDetails?: {
    date?: string;
    pregnancyAgeInWeeks?: number;
    positiveHivStatusBeforeService?: boolean;
    referredToCTC?: boolean;
    providedWithFamilyPlanningCounseling?: boolean;
    providedWithInfantFeedingCounseling?: boolean;
    gravidity?: number;
    hivDetails?: { code?: string; status?: string };
    syphilisDetails?: { code?: string; status?: string };
    spouseDetails?: {
      hivDetails?: { status?: string; code?: string };
      syphilisDetails?: { status?: string; code?: string };
      otherSpouseDetails?: any;
    };
    otherSpouseDetails?: any;
  };
  prophylaxisDetails?: any;
  vaccinationDetails?: any[];
  familyPlanningDetails?: any;
  laborAndDeliveryDetails?: {
    date?: string;
    deliveryMethod?: { code?: string; name?: string };
    placeOfBirth?: string;
    timeBetweenLaborPainAndDeliveryInHrs?: number;
    isAttendantSkilled?: boolean;
    providedWithFamilyPlanningCounseling?: boolean;
    providedWithInfantFeedingCounseling?: boolean;
    beforeBirthComplications?: any;
    birthComplications?: any;
    birthDetails?: any;
    others?: any;
  };
  postnatalDetails?: {
    date?: string;
    positiveHivStatusBeforeService?: boolean;
    referredToCTC?: boolean;
    referredToClinicForFurtherServices?: boolean;
    hoursSinceDelivery?: number;
    outCome?: any;
    breastFeedingDetails?: any;
    birthDetails?: any;
    demagedNipples?: boolean;
    mastitis?: boolean;
    breastAbscess?: boolean;
    fistula?: boolean;
    puerperalPsychosis?: boolean;
    otherServices?: any;
    apgarscore?: number;
  };
  billingsDetails?: any;
  visitMainPaymentDetails?: any;
  referralDetails?: {
    referralDate?: string;
    hfrCode?: string;
    reason?: string;
    referralNumber?: string;
    referringClinician?: string;
  };
  otherInformation?: any;

  static fromJson(json: any): HDUAPIClientDetails {
    const hduClient = new HDUAPIClientDetails();
    hduClient.demographicDetails = HduClient.fromJson(json['demographicDetails'] || {});
    hduClient.facilityDetails = {
      code: json['facilityDetails']?.['code'] || '',
      name: json['facilityDetails']?.['name'] || '',
    };
    hduClient.reportingDetails = json['reportingDetails'];
    hduClient.mrn = json['mrn'];
    hduClient.visitDetails = json['visitDetails'] || {};
    hduClient.clinicalInformation = json['clinicalInformation'] || {};
    hduClient.allergies = json['allergies'] || [];
    hduClient.chronicConditions = json['chronicConditions'] || [];
    hduClient.lifeStyleInformation = json['lifeStyleInformation'] || {};
    hduClient.investigationDetails = json['investigationDetails'] || [];
    hduClient.labInvestigationDetails = json['labInvestigationDetails'] || [];
    hduClient.diagnosisDetails = json['diagnosisDetails'] || [];
    hduClient.medicationDetails = json['medicationDetails'];
    hduClient.treatmentDetails = json['treatmentDetails'] || {};
    hduClient.radiologyDetails = json['radiologyDetails'];
    hduClient.admissionDetails = json['admissionDetails'];
    hduClient.outcomeDetails = json['outcomeDetails'] || {};
    hduClient.causesOfDeathDetails = json['causesOfDeathDetails'];
    hduClient.antenatalCareDetails = json['antenatalCareDetails'] || {};
    hduClient.prophylaxisDetails = json['prophylaxisDetails'];
    hduClient.vaccinationDetails = json['vaccinationDetails'] || [];
    hduClient.familyPlanningDetails = json['familyPlanningDetails'];
    hduClient.laborAndDeliveryDetails = json['laborAndDeliveryDetails'] || {};
    hduClient.postnatalDetails = json['postnatalDetails'] || {};
    hduClient.billingsDetails = json['billingsDetails'];
    hduClient.visitMainPaymentDetails = json['visitMainPaymentDetails'];
    hduClient.referralDetails = json['referralDetails'] || {};
    hduClient.otherInformation = json['otherInformation'];

    return hduClient;
  }
}
