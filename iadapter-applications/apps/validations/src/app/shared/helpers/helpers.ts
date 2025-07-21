export function calculateAge(dateOfBirth: string): string {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age.toString();
}

export function transformToDataModel(){
  const data : any = [
    {
      "path": "mrn",
      "label": "Mrn",
      "type": "STRING"
    },
    {
      "path": "facilityDetails.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "facilityDetails.name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "facilityDetails.bloodBags[]..bloodType",
      "label": "Blood Type",
      "type": "STRING"
    },
    {
      "path": "facilityDetails.bloodBags[]..quantity",
      "label": "Quantity",
      "type": "NUMBER"
    },
    {
      "path": "reportDetails.reportingDate",
      "label": "Reporting Date",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.id",
      "label": "Id",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.firstName",
      "label": "First Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.middleName",
      "label": "Middle Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.lastName",
      "label": "Last Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.dateOfBirth",
      "label": "Date Of Birth",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.gender",
      "label": "Gender",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.phoneNumbers[]",
      "label": "Phone Numbers (Item)",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.emails[]",
      "label": "Emails (Item)",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.occupation",
      "label": "Occupation",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.maritalStatus",
      "label": "Marital Status",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.nationality",
      "label": "Nationality",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.addresses[]..village",
      "label": "Village",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.addresses[]..ward",
      "label": "Ward",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.addresses[]..district",
      "label": "District",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.addresses[]..region",
      "label": "Region",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.addresses[]..country",
      "label": "Country",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.addresses[]..category",
      "label": "Category",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.identifiers[]..id",
      "label": "Id",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.identifiers[]..type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.identifiers[]..preferred",
      "label": "Preferred",
      "type": "BOOLEAN"
    },
    {
      "path": "demographicDetails.identifiers[]..system",
      "label": "System",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.identifiers[]..organization.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.identifiers[]..organization.name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.identifiers[]..organization.bloodBags[]..bloodType",
      "label": "Blood Type",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.identifiers[]..organization.bloodBags[]..quantity",
      "label": "Quantity",
      "type": "NUMBER"
    },
    {
      "path": "demographicDetails.contactPeople[]..firstName",
      "label": "First Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.contactPeople[]..lastName",
      "label": "Last Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.contactPeople[]..phoneNumbers[]",
      "label": "Phone Numbers (Item)",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.contactPeople[]..relationShip",
      "label": "Relation Ship",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.paymentDetails[]..type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.paymentDetails[]..shortName",
      "label": "Short Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.paymentDetails[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.paymentDetails[]..status",
      "label": "Status",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.paymentDetails[]..insuranceId",
      "label": "Insurance Id",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.paymentDetails[]..insuranceCode",
      "label": "Insurance Code",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.paymentDetails[]..policyNumber",
      "label": "Policy Number",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.paymentDetails[]..groupNumber",
      "label": "Group Number",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.relatedClients[]",
      "label": "Related Clients (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "demographicDetails.files[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.files[]..url",
      "label": "Url",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.files[]..id",
      "label": "Id",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..appointmentId",
      "label": "Appointment Id",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..hfrCode",
      "label": "Hfr Code",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..appointmentStatus",
      "label": "Appointment Status",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..paymentDetails[]..controlNumber",
      "label": "Control Number",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..paymentDetails[]..statusCode",
      "label": "Status Code",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..paymentDetails[]..description",
      "label": "Description",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..serviceDetails[]..serviceCode",
      "label": "Service Code",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..serviceDetails[]..serviceName",
      "label": "Service Name",
      "type": "STRING"
    },
    {
      "path": "demographicDetails.appointment[]..serviceDetails[]..shortName",
      "label": "Short Name",
      "type": "STRING"
    },
    {
      "path": "paymentDetails[]..type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "paymentDetails[]..shortName",
      "label": "Short Name",
      "type": "STRING"
    },
    {
      "path": "paymentDetails[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "paymentDetails[]..status",
      "label": "Status",
      "type": "STRING"
    },
    {
      "path": "paymentDetails[]..insuranceId",
      "label": "Insurance Id",
      "type": "STRING"
    },
    {
      "path": "paymentDetails[]..insuranceCode",
      "label": "Insurance Code",
      "type": "STRING"
    },
    {
      "path": "paymentDetails[]..policyNumber",
      "label": "Policy Number",
      "type": "STRING"
    },
    {
      "path": "paymentDetails[]..groupNumber",
      "label": "Group Number",
      "type": "STRING"
    },
    {
      "path": "visitDetails.id",
      "label": "Id",
      "type": "STRING"
    },
    {
      "path": "visitDetails.visitDate",
      "label": "Visit Date",
      "type": "STRING"
    },
    {
      "path": "visitDetails.newThisYear",
      "label": "New This Year",
      "type": "BOOLEAN"
    },
    {
      "path": "visitDetails.isNew",
      "label": "Is New",
      "type": "BOOLEAN"
    },
    {
      "path": "visitDetails.closedDate",
      "label": "Closed Date",
      "type": "STRING"
    },
    {
      "path": "visitDetails.visitType",
      "label": "Visit Type",
      "type": "STRING"
    },
    {
      "path": "visitDetails.careServices[]..careType",
      "label": "Care Type",
      "type": "ENUM",
      "options": [
        "OPD",
        "IPD",
        "ANC",
        "DENTAL",
        "EYE"
      ]
    },
    {
      "path": "visitDetails.careServices[]..visitNumber",
      "label": "Visit Number",
      "type": "NUMBER"
    },
    {
      "path": "visitDetails.attendedSpecialist[]..superSpecialist",
      "label": "Super Specialist",
      "type": "BOOLEAN"
    },
    {
      "path": "visitDetails.attendedSpecialist[]..specialist",
      "label": "Specialist",
      "type": "BOOLEAN"
    },
    {
      "path": "visitDetails.serviceComplaints.providedComplaints",
      "label": "Provided Complaints",
      "type": "BOOLEAN"
    },
    {
      "path": "visitDetails.serviceComplaints.complaints",
      "label": "Complaints",
      "type": "STRING"
    },
    {
      "path": "visitDetails.referredIn",
      "label": "Referred In",
      "type": "BOOLEAN"
    },
    {
      "path": "visitDetails.disabled",
      "label": "Disabled",
      "type": "BOOLEAN"
    },
    {
      "path": "selfMonitoringClinicalInformation.vitalSigns[]..bloodPressure",
      "label": "Blood Pressure",
      "type": "STRING"
    },
    {
      "path": "selfMonitoringClinicalInformation.vitalSigns[]..weight",
      "label": "Weight",
      "type": "NUMBER"
    },
    {
      "path": "selfMonitoringClinicalInformation.vitalSigns[]..temperature",
      "label": "Temperature",
      "type": "NUMBER"
    },
    {
      "path": "selfMonitoringClinicalInformation.vitalSigns[]..height",
      "label": "Height",
      "type": "NUMBER"
    },
    {
      "path": "selfMonitoringClinicalInformation.vitalSigns[]..respiration",
      "label": "Respiration",
      "type": "NUMBER"
    },
    {
      "path": "selfMonitoringClinicalInformation.vitalSigns[]..pulseRate",
      "label": "Pulse Rate",
      "type": "NUMBER"
    },
    {
      "path": "selfMonitoringClinicalInformation.vitalSigns[]..dateTime",
      "label": "Date Time",
      "type": "STRING"
    },
    {
      "path": "selfMonitoringClinicalInformation.vitalSigns[]..notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "appointment[]..appointmentId",
      "label": "Appointment Id",
      "type": "STRING"
    },
    {
      "path": "appointment[]..hfrCode",
      "label": "Hfr Code",
      "type": "STRING"
    },
    {
      "path": "appointment[]..appointmentStatus",
      "label": "Appointment Status",
      "type": "STRING"
    },
    {
      "path": "appointment[]..paymentDetails[]..controlNumber",
      "label": "Control Number",
      "type": "STRING"
    },
    {
      "path": "appointment[]..paymentDetails[]..statusCode",
      "label": "Status Code",
      "type": "STRING"
    },
    {
      "path": "appointment[]..paymentDetails[]..description",
      "label": "Description",
      "type": "STRING"
    },
    {
      "path": "appointment[]..serviceDetails[]..serviceCode",
      "label": "Service Code",
      "type": "STRING"
    },
    {
      "path": "appointment[]..serviceDetails[]..serviceName",
      "label": "Service Name",
      "type": "STRING"
    },
    {
      "path": "appointment[]..serviceDetails[]..shortName",
      "label": "Short Name",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.vitalSigns[]..bloodPressure",
      "label": "Blood Pressure",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.vitalSigns[]..weight",
      "label": "Weight",
      "type": "NUMBER"
    },
    {
      "path": "clinicalInformation.vitalSigns[]..temperature",
      "label": "Temperature",
      "type": "NUMBER"
    },
    {
      "path": "clinicalInformation.vitalSigns[]..height",
      "label": "Height",
      "type": "NUMBER"
    },
    {
      "path": "clinicalInformation.vitalSigns[]..respiration",
      "label": "Respiration",
      "type": "NUMBER"
    },
    {
      "path": "clinicalInformation.vitalSigns[]..pulseRate",
      "label": "Pulse Rate",
      "type": "NUMBER"
    },
    {
      "path": "clinicalInformation.vitalSigns[]..dateTime",
      "label": "Date Time",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.vitalSigns[]..notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..chiefComplains[]",
      "label": "Chief Complains (Item)",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..injured",
      "label": "Injured",
      "type": "BOOLEAN"
    },
    {
      "path": "clinicalInformation.visitNotes[]..historyOfPresentIllness[]",
      "label": "History Of Present Illness (Item)",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..reviewOfOtherSystems[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..reviewOfOtherSystems[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..reviewOfOtherSystems[]..notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..pastMedicalHistory[]",
      "label": "Past Medical History (Item)",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..familyAndSocialHistory[]",
      "label": "Family And Social History (Item)",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..generalExaminationObservation[]",
      "label": "General Examination Observation (Item)",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..localExamination[]",
      "label": "Local Examination (Item)",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..systemicExaminationObservation[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..systemicExaminationObservation[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..systemicExaminationObservation[]..notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..doctorPlanOrSuggestion[]",
      "label": "Doctor Plan Or Suggestion (Item)",
      "type": "STRING"
    },
    {
      "path": "clinicalInformation.visitNotes[]..providerSpeciality",
      "label": "Provider Speciality",
      "type": "STRING"
    },
    {
      "path": "allergies[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "allergies[]..category",
      "label": "Category",
      "type": "STRING"
    },
    {
      "path": "allergies[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "allergies[]..criticality",
      "label": "Criticality",
      "type": "STRING"
    },
    {
      "path": "allergies[]..verificationStatus",
      "label": "Verification Status",
      "type": "STRING"
    },
    {
      "path": "chronicConditions[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "chronicConditions[]..category",
      "label": "Category",
      "type": "STRING"
    },
    {
      "path": "chronicConditions[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "chronicConditions[]..criticality",
      "label": "Criticality",
      "type": "STRING"
    },
    {
      "path": "chronicConditions[]..verificationStatus",
      "label": "Verification Status",
      "type": "STRING"
    },
    {
      "path": "lifeStyleInformation.smoking",
      "label": "Smoking",
      "type": "MAP_OBJECT"
    },
    {
      "path": "lifeStyleInformation.alcoholUse",
      "label": "Alcohol Use",
      "type": "MAP_OBJECT"
    },
    {
      "path": "lifeStyleInformation.drugUse",
      "label": "Drug Use",
      "type": "MAP_OBJECT"
    },
    {
      "path": "investigationDetails[]..dateOccurred",
      "label": "Date Occurred",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..caseClassification",
      "label": "Case Classification",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..daysSinceSymptoms",
      "label": "Days Since Symptoms",
      "type": "NUMBER"
    },
    {
      "path": "investigationDetails[]..diseaseCode",
      "label": "Disease Code",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..labSpecimenTaken",
      "label": "Lab Specimen Taken",
      "type": "BOOLEAN"
    },
    {
      "path": "investigationDetails[]..specimenSentToLab",
      "label": "Specimen Sent To Lab",
      "type": "BOOLEAN"
    },
    {
      "path": "investigationDetails[]..vaccinated",
      "label": "Vaccinated",
      "type": "BOOLEAN"
    },
    {
      "path": "investigationDetails[]..specimenCollected",
      "label": "Specimen Collected",
      "type": "BOOLEAN"
    },
    {
      "path": "investigationDetails[]..dateSpecimenCollected",
      "label": "Date Specimen Collected",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..specimenCollectedFrom",
      "label": "Specimen Collected From",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..specimenID",
      "label": "Specimen ID",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..typeOfSpecimen",
      "label": "Type Of Specimen",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..dateSpecimenSentToLab",
      "label": "Date Specimen Sent To Lab",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..laboratoryName",
      "label": "Laboratory Name",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..typeOfTest",
      "label": "Type Of Test",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..specimenAcceptanceStatus",
      "label": "Specimen Acceptance Status",
      "type": "ENUM",
      "options": [
        "REJECTED",
        "ACCEPTED"
      ]
    },
    {
      "path": "investigationDetails[]..specimenCollectorName",
      "label": "Specimen Collector Name",
      "type": "STRING"
    },
    {
      "path": "investigationDetails[]..specimenCollectorContactNumber",
      "label": "Specimen Collector Contact Number",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testCode",
      "label": "Test Code",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testOrderDate",
      "label": "Test Order Date",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testSampleId",
      "label": "Test Sample Id",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testOrderId",
      "label": "Test Order Id",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResultDate",
      "label": "Test Result Date",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testStatus",
      "label": "Test Status",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testType",
      "label": "Test Type",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..standardCode",
      "label": "Standard Code",
      "type": "BOOLEAN"
    },
    {
      "path": "labInvestigationDetails[]..codeType",
      "label": "Code Type",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..parameter",
      "label": "Parameter",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..releaseDate",
      "label": "Release Date",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..result",
      "label": "Result",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..codedValue",
      "label": "Coded Value",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..valueType",
      "label": "Value Type",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..standardCode",
      "label": "Standard Code",
      "type": "BOOLEAN"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..codeType",
      "label": "Code Type",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..unit",
      "label": "Unit",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..lowRange",
      "label": "Low Range",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..highRange",
      "label": "High Range",
      "type": "STRING"
    },
    {
      "path": "labInvestigationDetails[]..testResults[]..remarks",
      "label": "Remarks",
      "type": "STRING"
    },
    {
      "path": "diagnosisDetails[]..diagnosisDate",
      "label": "Diagnosis Date",
      "type": "STRING"
    },
    {
      "path": "diagnosisDetails[]..certainty",
      "label": "Certainty",
      "type": "STRING"
    },
    {
      "path": "diagnosisDetails[]..diagnosis",
      "label": "Diagnosis",
      "type": "STRING"
    },
    {
      "path": "diagnosisDetails[]..diagnosisCode",
      "label": "Diagnosis Code",
      "type": "STRING"
    },
    {
      "path": "diagnosisDetails[]..diagnosisDescription",
      "label": "Diagnosis Description",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..orderDate",
      "label": "Order Date",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..periodOfMedication",
      "label": "Period Of Medication",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..codeStandard",
      "label": "Code Standard",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..treatmentType",
      "label": "Treatment Type",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..dosage",
      "label": "Dosage",
      "type": "MAP_OBJECT"
    },
    {
      "path": "medicationDetails[]..refillStatus",
      "label": "Refill Status",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..currentRefill",
      "label": "Current Refill",
      "type": "NUMBER"
    },
    {
      "path": "medicationDetails[]..maxRefill",
      "label": "Max Refill",
      "type": "NUMBER"
    },
    {
      "path": "medicationDetails[]..paymentDetails.controlNumber",
      "label": "Control Number",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..paymentDetails.statusCode",
      "label": "Status Code",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..paymentDetails.status",
      "label": "Status",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..paymentDetails.type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "medicationDetails[]..paymentDetails.description",
      "label": "Description",
      "type": "STRING"
    },
    {
      "path": "treatmentDetails.chemoTherapy[]",
      "label": "Chemo Therapy (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "treatmentDetails.radioTherapy[]",
      "label": "Radio Therapy (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "treatmentDetails.palliativeCare[]",
      "label": "Palliative Care (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "treatmentDetails.surgery[]",
      "label": "Surgery (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "treatmentDetails.hormoneTherapy[]",
      "label": "Hormone Therapy (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "treatmentDetails.symptomatic",
      "label": "Symptomatic",
      "type": "STRING"
    },
    {
      "path": "treatmentDetails.alternativeTreatment",
      "label": "Alternative Treatment",
      "type": "STRING"
    },
    {
      "path": "treatmentDetails.medicalProcedureDetails[]..procedureDate",
      "label": "Procedure Date",
      "type": "STRING"
    },
    {
      "path": "treatmentDetails.medicalProcedureDetails[]..procedureType",
      "label": "Procedure Type",
      "type": "STRING"
    },
    {
      "path": "treatmentDetails.medicalProcedureDetails[]..findings",
      "label": "Findings",
      "type": "STRING"
    },
    {
      "path": "treatmentDetails.medicalProcedureDetails[]..diagnosis",
      "label": "Diagnosis",
      "type": "STRING"
    },
    {
      "path": "eyeClinicDetails.refracted",
      "label": "Refracted",
      "type": "BOOLEAN"
    },
    {
      "path": "eyeClinicDetails.spectaclesPrescribed",
      "label": "Spectacles Prescribed",
      "type": "BOOLEAN"
    },
    {
      "path": "eyeClinicDetails.spectacleDispensed",
      "label": "Spectacle Dispensed",
      "type": "BOOLEAN"
    },
    {
      "path": "eyeClinicDetails.contactLenseDispensed",
      "label": "Contact Lense Dispensed",
      "type": "BOOLEAN"
    },
    {
      "path": "eyeClinicDetails.prescribedWithLowVision",
      "label": "Prescribed With Low Vision",
      "type": "BOOLEAN"
    },
    {
      "path": "eyeClinicDetails.isDispensedWithLowVisionDevice",
      "label": "Is Dispensed With Low Vision Device",
      "type": "BOOLEAN"
    },
    {
      "path": "radiologyDetails[]..testDate",
      "label": "Test Date",
      "type": "STRING"
    },
    {
      "path": "radiologyDetails[]..testTypeName",
      "label": "Test Type Name",
      "type": "STRING"
    },
    {
      "path": "radiologyDetails[]..testTypeCode",
      "label": "Test Type Code",
      "type": "STRING"
    },
    {
      "path": "radiologyDetails[]..testReport",
      "label": "Test Report",
      "type": "STRING"
    },
    {
      "path": "radiologyDetails[]..bodySite",
      "label": "Body Site",
      "type": "STRING"
    },
    {
      "path": "radiologyDetails[]..url",
      "label": "Url",
      "type": "STRING"
    },
    {
      "path": "admissionDetails.admissionDate",
      "label": "Admission Date",
      "type": "STRING"
    },
    {
      "path": "admissionDetails.admissionDiagnosis",
      "label": "Admission Diagnosis",
      "type": "STRING"
    },
    {
      "path": "admissionDetails.dischargedOn",
      "label": "Discharged On",
      "type": "STRING"
    },
    {
      "path": "admissionDetails.dischargeStatus",
      "label": "Discharge Status",
      "type": "STRING"
    },
    {
      "path": "outcomeDetails.isAlive",
      "label": "Is Alive",
      "type": "BOOLEAN"
    },
    {
      "path": "outcomeDetails.deathLocation",
      "label": "Death Location",
      "type": "STRING"
    },
    {
      "path": "outcomeDetails.deathDate",
      "label": "Death Date",
      "type": "STRING"
    },
    {
      "path": "outcomeDetails.contactTracing",
      "label": "Contact Tracing",
      "type": "BOOLEAN"
    },
    {
      "path": "outcomeDetails.investigationConducted",
      "label": "Investigation Conducted",
      "type": "BOOLEAN"
    },
    {
      "path": "outcomeDetails.quarantined",
      "label": "Quarantined",
      "type": "BOOLEAN"
    },
    {
      "path": "outcomeDetails.referred",
      "label": "Referred",
      "type": "BOOLEAN"
    },
    {
      "path": "outcomeDetails.dischargedLocation",
      "label": "Discharged Location",
      "type": "ENUM",
      "options": [
        "H",
        "RD",
        "RCH",
        "RHS",
        "PNC"
      ]
    },
    {
      "path": "causesOfDeathDetails.dateOfDeath",
      "label": "Date Of Death",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.lineA",
      "label": "Line A",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.lineB",
      "label": "Line B",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.lineC",
      "label": "Line C",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.lineD",
      "label": "Line D",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.causeOfDeathOther",
      "label": "Cause Of Death Other",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.mannerOfDeath",
      "label": "Manner Of Death",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.placeOfDeath",
      "label": "Place Of Death",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.otherDeathDetails.postmortemDetails",
      "label": "Postmortem Details",
      "type": "STRING"
    },
    {
      "path": "causesOfDeathDetails.otherDeathDetails.marcerated",
      "label": "Marcerated",
      "type": "BOOLEAN"
    },
    {
      "path": "causesOfDeathDetails.otherDeathDetails.fresh",
      "label": "Fresh",
      "type": "BOOLEAN"
    },
    {
      "path": "causesOfDeathDetails.otherDeathDetails.motherCondition",
      "label": "Mother Condition",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.pregnancyAgeInWeeks",
      "label": "Pregnancy Age In Weeks",
      "type": "NUMBER"
    },
    {
      "path": "antenatalCareDetails.positiveHivStatusBeforeService",
      "label": "Positive Hiv Status Before Service",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.referredToCTC",
      "label": "Referred To CTC",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.gravidity",
      "label": "Gravidity",
      "type": "NUMBER"
    },
    {
      "path": "antenatalCareDetails.hivDetails.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "antenatalCareDetails.hivDetails.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.hivDetails.hivTestNumber",
      "label": "Hiv Test Number",
      "type": "NUMBER"
    },
    {
      "path": "antenatalCareDetails.syphilisDetails.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "antenatalCareDetails.syphilisDetails.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.syphilisDetails.providedWithTreatment",
      "label": "Provided With Treatment",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.hivDetails.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "antenatalCareDetails.spouseDetails.hivDetails.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.hivDetails.hivTestNumber",
      "label": "Hiv Test Number",
      "type": "NUMBER"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.syphilisDetails.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "antenatalCareDetails.spouseDetails.syphilisDetails.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.syphilisDetails.providedWithTreatment",
      "label": "Provided With Treatment",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.hepatitisB.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "antenatalCareDetails.spouseDetails.hepatitisB.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.hepatitisB.providedWithTreatment",
      "label": "Provided With Treatment",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.diagnosedWithOtherSTDs",
      "label": "Diagnosed With Other STDs",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.providedWithTreatmentForOtherSTDs",
      "label": "Provided With Treatment For Other STDs",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.spouseDetails.otherSpouseDetails[]",
      "label": "Other Spouse Details (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "antenatalCareDetails.otherSpouseDetails[]",
      "label": "Other Spouse Details (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "antenatalCareDetails.lastAncVisitDate",
      "label": "Last Anc Visit Date",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.referredIn",
      "label": "Referred In",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.referredOut",
      "label": "Referred Out",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.counselling[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.counselling[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "antenatalCareDetails.providedWithHivCounsellingBeforeLabTest",
      "label": "Provided With Hiv Counselling Before Lab Test",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.providedWithHivCounsellingAfterLabTest",
      "label": "Provided With Hiv Counselling After Lab Test",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.prophylaxis.providedWithLLIN",
      "label": "Provided With LLIN",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.prophylaxis.providedWithIPT2",
      "label": "Provided With IPT2",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.prophylaxis.providedWithIPT3",
      "label": "Provided With IPT3",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.prophylaxis.providedWithIPT4",
      "label": "Provided With IPT4",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.prophylaxis.providedWithMebendazoleOrAlbendazole",
      "label": "Provided With Mebendazole Or Albendazole",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.prophylaxis.providedWithIFFolic60Tablets",
      "label": "Provided With IFFolic60Tablets",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.diagnosedWithOtherSTDs",
      "label": "Diagnosed With Other STDs",
      "type": "BOOLEAN"
    },
    {
      "path": "antenatalCareDetails.providedWithTreatmentForOtherSTDs",
      "label": "Provided With Treatment For Other STDs",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.deliveryMethod",
      "label": "Delivery Method",
      "type": "MAP_OBJECT"
    },
    {
      "path": "laborAndDeliveryDetails.placeOfBirth",
      "label": "Place Of Birth",
      "type": "ENUM",
      "options": [
        "LD",
        "RHC",
        "RHS",
        "TBA",
        "H",
        "BBA",
        "HF"
      ]
    },
    {
      "path": "laborAndDeliveryDetails.timeBetweenLaborPainAndDeliveryInHrs",
      "label": "Time Between Labor Pain And Delivery In Hrs",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.isAttendantSkilled",
      "label": "Is Attendant Skilled",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.providedWithFamilyPlanningCounseling",
      "label": "Provided With Family Planning Counseling",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.providedWithInfantFeedingCounseling",
      "label": "Provided With Infant Feeding Counseling",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.beforeBirthComplications[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.beforeBirthComplications[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthComplications[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthComplications[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..dateOfBirth",
      "label": "Date Of Birth",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..weightInKgs",
      "label": "Weight In Kgs",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..multipleBirth",
      "label": "Multiple Birth",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..exclusiveBreastFed",
      "label": "Exclusive Breast Fed",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..marcerated",
      "label": "Marcerated",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..fresh",
      "label": "Fresh",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..motherAgeInYears",
      "label": "Mother Age In Years",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..birthOrder",
      "label": "Birth Order",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..infantFeeding",
      "label": "Infant Feeding",
      "type": "ENUM",
      "options": [
        "EBF",
        "RF",
        "MF"
      ]
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..gender",
      "label": "Gender",
      "type": "ENUM",
      "options": [
        "M",
        "F"
      ]
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..providedWithKmc",
      "label": "Provided With Kmc",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..hb",
      "label": "Hb",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..hbigTested",
      "label": "Hbig Tested",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..childHivStatus",
      "label": "Child Hiv Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..infections.hasSepticaemia",
      "label": "Has Septicaemia",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..infections.hasOmphalitis",
      "label": "Has Omphalitis",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..infections.hasSkinInfection",
      "label": "Has Skin Infection",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..infections.hasOcularInfection",
      "label": "Has Ocular Infection",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..infections.hasJaundice",
      "label": "Has Jaundice",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..outcomeDetails.referredToHospital",
      "label": "Referred To Hospital",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..outcomeDetails.referredtohealthfacility",
      "label": "Referredtohealthfacility",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..motherHivStatus",
      "label": "Mother Hiv Status",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..providedWithARV",
      "label": "Provided With ARV",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..referred",
      "label": "Referred",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..vaccinationModality",
      "label": "Vaccination Modality",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..status",
      "label": "Status",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..dosage",
      "label": "Dosage",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..reaction.reactionDate",
      "label": "Reaction Date",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..reaction.notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..vaccinationDetails[]..reaction.reported",
      "label": "Reported",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..otherServices[]",
      "label": "Other Services (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..bornWithDisabilities",
      "label": "Born With Disabilities",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..apgaScore.oneMinute",
      "label": "One Minute",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..apgaScore.fiveMinute",
      "label": "Five Minute",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..wasBreastFedWithinOneHourAfterDelivery",
      "label": "Was Breast Fed Within One Hour After Delivery",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..methodOfResuscitation",
      "label": "Method Of Resuscitation",
      "type": "ENUM",
      "options": [
        "SUCTION",
        "STIMULATION",
        "BAGANDMASK"
      ]
    },
    {
      "path": "laborAndDeliveryDetails.birthDetails[]..hivDnaPCRTested",
      "label": "Hiv Dna PCRTested",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.emoc.providedAntibiotic",
      "label": "Provided Antibiotic",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.emoc.providedUterotonic",
      "label": "Provided Uterotonic",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.emoc.providedMagnesiumSulphate",
      "label": "Provided Magnesium Sulphate",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.emoc.removedPlacenta",
      "label": "Removed Placenta",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.emoc.performedMvaOrDc",
      "label": "Performed Mva Or Dc",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.emoc.administeredBlood",
      "label": "Administered Blood",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.amstl.cordTractionUsed",
      "label": "Cord Traction Used",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.amstl.uterineMassageDone",
      "label": "Uterine Massage Done",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.amstl.administeredOxytocin",
      "label": "Administered Oxytocin",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.amstl.administeredEgometrine",
      "label": "Administered Egometrine",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.amstl.administeredMisoprostol",
      "label": "Administered Misoprostol",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.others.familyPlanning[]",
      "label": "Family Planning (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "laborAndDeliveryDetails.motherOrigin",
      "label": "Mother Origin",
      "type": "ENUM",
      "options": [
        "LD",
        "RHC",
        "RHS",
        "TBA",
        "H",
        "RD",
        "D",
        "HC",
        "HS"
      ]
    },
    {
      "path": "laborAndDeliveryDetails.hasComeWithSpouse",
      "label": "Has Come With Spouse",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.hasComeWithCompanion",
      "label": "Has Come With Companion",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.pregnancyAgeInWeeks",
      "label": "Pregnancy Age In Weeks",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.wasProvidedWithAntenatalCorticosteroid",
      "label": "Was Provided With Antenatal Corticosteroid",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.hasHistoryOfFGM",
      "label": "Has History Of FGM",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.hivDetails.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "laborAndDeliveryDetails.hivDetails.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "laborAndDeliveryDetails.hivDetails.hivTestNumber",
      "label": "Hiv Test Number",
      "type": "NUMBER"
    },
    {
      "path": "laborAndDeliveryDetails.hivDetails.referredToCTC",
      "label": "Referred To CTC",
      "type": "BOOLEAN"
    },
    {
      "path": "laborAndDeliveryDetails.hivDetails.ancHivStatus.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "laborAndDeliveryDetails.hivDetails.ancHivStatus.numberOfTestTaken",
      "label": "Number Of Test Taken",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.positiveHivStatusBeforeService",
      "label": "Positive Hiv Status Before Service",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.hivStatusAsSeenFromAncCard",
      "label": "Hiv Status As Seen From Anc Card",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "postnatalDetails.hivDetails.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "postnatalDetails.hivDetails.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.hivDetails.hivTestNumber",
      "label": "Hiv Test Number",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.motherAndChildOrigin",
      "label": "Mother And Child Origin",
      "type": "ENUM",
      "options": [
        "LD",
        "RHC",
        "RHS",
        "TBA",
        "H",
        "RD",
        "D",
        "HC",
        "HS"
      ]
    },
    {
      "path": "postnatalDetails.referredToCTC",
      "label": "Referred To CTC",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.placeOfBirth",
      "label": "Place Of Birth",
      "type": "ENUM",
      "options": [
        "LD",
        "RHC",
        "RHS",
        "TBA",
        "H",
        "BBA",
        "HF"
      ]
    },
    {
      "path": "postnatalDetails.prophylaxis.providedWithAntenatalCorticosteroids",
      "label": "Provided With Antenatal Corticosteroids",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.prophylaxis.provideWithVitaminA",
      "label": "Provide With Vitamin A",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.prophylaxis.providedWithFEFO",
      "label": "Provided With FEFO",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.counselling[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.counselling[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.referredToClinicForFurtherServices",
      "label": "Referred To Clinic For Further Services",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.daysSinceDelivery",
      "label": "Days Since Delivery",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.outCome",
      "label": "Out Come",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.APGARScore",
      "label": "APGARScore",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.breastFeedingDetails",
      "label": "Breast Feeding Details",
      "type": "MAP_OBJECT"
    },
    {
      "path": "postnatalDetails.birthDetails[]..dateOfBirth",
      "label": "Date Of Birth",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..weightInKgs",
      "label": "Weight In Kgs",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.birthDetails[]..multipleBirth",
      "label": "Multiple Birth",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..exclusiveBreastFed",
      "label": "Exclusive Breast Fed",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..marcerated",
      "label": "Marcerated",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..fresh",
      "label": "Fresh",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..motherAgeInYears",
      "label": "Mother Age In Years",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.birthDetails[]..birthOrder",
      "label": "Birth Order",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.birthDetails[]..infantFeeding",
      "label": "Infant Feeding",
      "type": "ENUM",
      "options": [
        "EBF",
        "RF",
        "MF"
      ]
    },
    {
      "path": "postnatalDetails.birthDetails[]..gender",
      "label": "Gender",
      "type": "ENUM",
      "options": [
        "M",
        "F"
      ]
    },
    {
      "path": "postnatalDetails.birthDetails[]..providedWithKmc",
      "label": "Provided With Kmc",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..hb",
      "label": "Hb",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.birthDetails[]..hbigTested",
      "label": "Hbig Tested",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..childHivStatus",
      "label": "Child Hiv Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "postnatalDetails.birthDetails[]..infections.hasSepticaemia",
      "label": "Has Septicaemia",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..infections.hasOmphalitis",
      "label": "Has Omphalitis",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..infections.hasSkinInfection",
      "label": "Has Skin Infection",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..infections.hasOcularInfection",
      "label": "Has Ocular Infection",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..infections.hasJaundice",
      "label": "Has Jaundice",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..outcomeDetails.referredToHospital",
      "label": "Referred To Hospital",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..outcomeDetails.referredtohealthfacility",
      "label": "Referredtohealthfacility",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..motherHivStatus",
      "label": "Mother Hiv Status",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..providedWithARV",
      "label": "Provided With ARV",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..referred",
      "label": "Referred",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..vaccinationModality",
      "label": "Vaccination Modality",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..status",
      "label": "Status",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..dosage",
      "label": "Dosage",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..reaction.reactionDate",
      "label": "Reaction Date",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..reaction.notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.birthDetails[]..vaccinationDetails[]..reaction.reported",
      "label": "Reported",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..otherServices[]",
      "label": "Other Services (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "postnatalDetails.birthDetails[]..bornWithDisabilities",
      "label": "Born With Disabilities",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..apgaScore.oneMinute",
      "label": "One Minute",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.birthDetails[]..apgaScore.fiveMinute",
      "label": "Five Minute",
      "type": "NUMBER"
    },
    {
      "path": "postnatalDetails.birthDetails[]..wasBreastFedWithinOneHourAfterDelivery",
      "label": "Was Breast Fed Within One Hour After Delivery",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.birthDetails[]..methodOfResuscitation",
      "label": "Method Of Resuscitation",
      "type": "ENUM",
      "options": [
        "SUCTION",
        "STIMULATION",
        "BAGANDMASK"
      ]
    },
    {
      "path": "postnatalDetails.birthDetails[]..hivDnaPCRTested",
      "label": "Hiv Dna PCRTested",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.demagedNipples.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.demagedNipples.name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.demagedNipples.provided",
      "label": "Provided",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.mastitis.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.mastitis.name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.mastitis.provided",
      "label": "Provided",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.breastAbscess.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.breastAbscess.name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.breastAbscess.provided",
      "label": "Provided",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.fistula.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.fistula.name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.fistula.provided",
      "label": "Provided",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.puerperalPsychosis.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.puerperalPsychosis.name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "postnatalDetails.puerperalPsychosis.provided",
      "label": "Provided",
      "type": "BOOLEAN"
    },
    {
      "path": "postnatalDetails.otherServices[]",
      "label": "Other Services (Item)",
      "type": "GENERIC_OBJECT"
    },
    {
      "path": "prophylAxisDetails[]..date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "prophylAxisDetails[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "prophylAxisDetails[]..type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "prophylAxisDetails[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "prophylAxisDetails[]..status",
      "label": "Status",
      "type": "STRING"
    },
    {
      "path": "prophylAxisDetails[]..notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "prophylAxisDetails[]..reaction.reactionDate",
      "label": "Reaction Date",
      "type": "STRING"
    },
    {
      "path": "prophylAxisDetails[]..reaction.notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "prophylAxisDetails[]..reaction.reported",
      "label": "Reported",
      "type": "BOOLEAN"
    },
    {
      "path": "vaccinationDetails[]..date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..vaccinationModality",
      "label": "Vaccination Modality",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..status",
      "label": "Status",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..dosage",
      "label": "Dosage",
      "type": "NUMBER"
    },
    {
      "path": "vaccinationDetails[]..reaction.reactionDate",
      "label": "Reaction Date",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..reaction.notes",
      "label": "Notes",
      "type": "STRING"
    },
    {
      "path": "vaccinationDetails[]..reaction.reported",
      "label": "Reported",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "familyPlanningDetails.positiveHivStatusBeforeService",
      "label": "Positive Hiv Status Before Service",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.wasCounselled",
      "label": "Was Counselled",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.hasComeWithSpouse",
      "label": "Has Come With Spouse",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.serviceLocation",
      "label": "Service Location",
      "type": "ENUM",
      "options": [
        "FOR",
        "CBD",
        "RCH",
        "CTC",
        "COR"
      ]
    },
    {
      "path": "familyPlanningDetails.referred",
      "label": "Referred",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms",
      "label": "Found With Breast Cancer Symptoms",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.cancerScreeningDetails.breastCancer.screened",
      "label": "Screened",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.hivStatus.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "familyPlanningDetails.hivStatus.referredToCTC",
      "label": "Referred To CTC",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.spouseHivStatus.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "familyPlanningDetails.spouseHivStatus.referredToCTC",
      "label": "Referred To CTC",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.breastFeeding",
      "label": "Breast Feeding",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.sideEffects.bleeding",
      "label": "Bleeding",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.sideEffects.headache",
      "label": "Headache",
      "type": "BOOLEAN"
    },
    {
      "path": "familyPlanningDetails.sideEffects.gotPregnancy",
      "label": "Got Pregnancy",
      "type": "BOOLEAN"
    },
    {
      "path": "childHealthDetails.serviceModality",
      "label": "Service Modality",
      "type": "ENUM",
      "options": [
        "CAMPAIGN",
        "ROUTINE"
      ]
    },
    {
      "path": "childHealthDetails.motherAge",
      "label": "Mother Age",
      "type": "NUMBER"
    },
    {
      "path": "childHealthDetails.prophylaxis.albendazole.administered",
      "label": "Administered",
      "type": "BOOLEAN"
    },
    {
      "path": "childHealthDetails.prophylaxis.vitaminA.administered",
      "label": "Administered",
      "type": "BOOLEAN"
    },
    {
      "path": "childHealthDetails.prophylaxis.providedWithLLIN",
      "label": "Provided With LLIN",
      "type": "BOOLEAN"
    },
    {
      "path": "childHealthDetails.infantFeeding",
      "label": "Infant Feeding",
      "type": "ENUM",
      "options": [
        "EBF",
        "RF",
        "MF"
      ]
    },
    {
      "path": "childHealthDetails.providedWithInfantFeedingCounselling",
      "label": "Provided With Infant Feeding Counselling",
      "type": "BOOLEAN"
    },
    {
      "path": "childHealthDetails.hasBeenBreastFedFor24Month",
      "label": "Has Been Breast Fed For24Month",
      "type": "BOOLEAN"
    },
    {
      "path": "childHealthDetails.motherHivStatus.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "childHealthDetails.motherHivStatus.testingDate",
      "label": "Testing Date",
      "type": "STRING"
    },
    {
      "path": "childHealthDetails.referredToCTC",
      "label": "Referred To CTC",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.pregnancyAgeInWeeks",
      "label": "Pregnancy Age In Weeks",
      "type": "NUMBER"
    },
    {
      "path": "cpacDetails.causeOfAbortion",
      "label": "Cause Of Abortion",
      "type": "ENUM",
      "options": [
        "SPONTANEOUS",
        "SAVELIFE",
        "DRUGUSESIDEEFFECTS",
        "OTHERS"
      ]
    },
    {
      "path": "cpacDetails.afterAbortionServices",
      "label": "After Abortion Services",
      "type": "ENUM",
      "options": [
        "MVA",
        "MEDICALTREATMENT",
        "SHARPCURRATAGE"
      ]
    },
    {
      "path": "cpacDetails.positiveHIVStatusBeforeAbortion",
      "label": "Positive HIVStatus Before Abortion",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.hivTest.status",
      "label": "Status",
      "type": "ENUM",
      "options": [
        "NEGATIVE",
        "POSITIVE"
      ]
    },
    {
      "path": "cpacDetails.referReason",
      "label": "Refer Reason",
      "type": "ENUM",
      "options": [
        "CPAC",
        "OTHERS"
      ]
    },
    {
      "path": "cpacDetails.postAbortionsMedications.providedWithAntibiotics",
      "label": "Provided With Antibiotics",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.postAbortionsMedications.providedWithPainKillers",
      "label": "Provided With Pain Killers",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.postAbortionsMedications.providedWithOxytocin",
      "label": "Provided With Oxytocin",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.postAbortionsMedications.providedWithMisoprostol",
      "label": "Provided With Misoprostol",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.postAbortionsMedications.providedWithIvInfusion",
      "label": "Provided With Iv Infusion",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.postAbortionCounselling.providedWithSTDsPreventionCounselling",
      "label": "Provided With STDs Prevention Counselling",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.postAbortionCounselling.providedWithHIVCounselling",
      "label": "Provided With HIVCounselling",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.postAbortionCounselling.providedWithFamilyPlanningCounselling",
      "label": "Provided With Family Planning Counselling",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.didReceiveOralPillsPOP",
      "label": "Did Receive Oral Pills POP",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.popCyclesProvided",
      "label": "Pop Cycles Provided",
      "type": "NUMBER"
    },
    {
      "path": "cpacDetails.contraceptives.didReceiveOralPillsCOC",
      "label": "Did Receive Oral Pills COC",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.cocCyclesProvided",
      "label": "Coc Cycles Provided",
      "type": "NUMBER"
    },
    {
      "path": "cpacDetails.contraceptives.didReceivePillCycles",
      "label": "Did Receive Pill Cycles",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.wasInsertedWithImplanon",
      "label": "Was Inserted With Implanon",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.wasInsertedWithJadelle",
      "label": "Was Inserted With Jadelle",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.didReceiveIUD",
      "label": "Did Receive IUD",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.didHaveTubalLigation",
      "label": "Did Have Tubal Ligation",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.didReceiveInjection",
      "label": "Did Receive Injection",
      "type": "BOOLEAN"
    },
    {
      "path": "cpacDetails.contraceptives.numberOfFemaleCondomsProvided",
      "label": "Number Of Female Condoms Provided",
      "type": "NUMBER"
    },
    {
      "path": "cpacDetails.contraceptives.numberOfMaleCondomsProvided",
      "label": "Number Of Male Condoms Provided",
      "type": "NUMBER"
    },
    {
      "path": "cecap.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms",
      "label": "Found With Breast Cancer Symptoms",
      "type": "BOOLEAN"
    },
    {
      "path": "cecap.cancerScreeningDetails.breastCancer.screened",
      "label": "Screened",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didReceiveOralPillsPOP",
      "label": "Did Receive Oral Pills POP",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.popCyclesProvided",
      "label": "Pop Cycles Provided",
      "type": "NUMBER"
    },
    {
      "path": "contraceptives.didReceiveOralPillsCOC",
      "label": "Did Receive Oral Pills COC",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.cocCyclesProvided",
      "label": "Coc Cycles Provided",
      "type": "NUMBER"
    },
    {
      "path": "contraceptives.didReceivePillCycles",
      "label": "Did Receive Pill Cycles",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.wasInsertedWithImplanon",
      "label": "Was Inserted With Implanon",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.wasInsertedWithJadelle",
      "label": "Was Inserted With Jadelle",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didReceiveIUD",
      "label": "Did Receive IUD",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didHaveTubalLigation",
      "label": "Did Have Tubal Ligation",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didReceiveInjection",
      "label": "Did Receive Injection",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.numberOfFemaleCondomsProvided",
      "label": "Number Of Female Condoms Provided",
      "type": "NUMBER"
    },
    {
      "path": "contraceptives.numberOfMaleCondomsProvided",
      "label": "Number Of Male Condoms Provided",
      "type": "NUMBER"
    },
    {
      "path": "contraceptives.didReceiveSDM",
      "label": "Did Receive SDM",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didUseLAM",
      "label": "Did Use LAM",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didOptToUseEmergencyMethods",
      "label": "Did Opt To Use Emergency Methods",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didRemoveIUD",
      "label": "Did Remove IUD",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didRemoveImplanon",
      "label": "Did Remove Implanon",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didRemoveJadelle",
      "label": "Did Remove Jadelle",
      "type": "BOOLEAN"
    },
    {
      "path": "contraceptives.didHaveVasectomy",
      "label": "Did Have Vasectomy",
      "type": "BOOLEAN"
    },
    {
      "path": "billingsDetails[]..billID",
      "label": "Bill ID",
      "type": "STRING"
    },
    {
      "path": "billingsDetails[]..billingCode",
      "label": "Billing Code",
      "type": "STRING"
    },
    {
      "path": "billingsDetails[]..billType",
      "label": "Bill Type",
      "type": "STRING"
    },
    {
      "path": "billingsDetails[]..insuranceCode",
      "label": "Insurance Code",
      "type": "STRING"
    },
    {
      "path": "billingsDetails[]..insuranceName",
      "label": "Insurance Name",
      "type": "STRING"
    },
    {
      "path": "billingsDetails[]..amountBilled",
      "label": "Amount Billed",
      "type": "NUMBER"
    },
    {
      "path": "billingsDetails[]..exemptionType",
      "label": "Exemption Type",
      "type": "STRING"
    },
    {
      "path": "billingsDetails[]..wavedAmount",
      "label": "Waved Amount",
      "type": "STRING"
    },
    {
      "path": "billingsDetails[]..standardCode",
      "label": "Standard Code",
      "type": "STRING"
    },
    {
      "path": "billingsDetails[]..billDate",
      "label": "Bill Date",
      "type": "STRING"
    },
    {
      "path": "visitMainPaymentDetails.shortName",
      "label": "Short Name",
      "type": "STRING"
    },
    {
      "path": "visitMainPaymentDetails.type",
      "label": "Type",
      "type": "STRING"
    },
    {
      "path": "visitMainPaymentDetails.insuranceCode",
      "label": "Insurance Code",
      "type": "STRING"
    },
    {
      "path": "visitMainPaymentDetails.name",
      "label": "Name",
      "type": "STRING"
    },
    {
      "path": "visitMainPaymentDetails.insuranceId",
      "label": "Insurance Id",
      "type": "STRING"
    },
    {
      "path": "referralDetails.referralDate",
      "label": "Referral Date",
      "type": "STRING"
    },
    {
      "path": "referralDetails.hfrCode",
      "label": "Hfr Code",
      "type": "STRING"
    },
    {
      "path": "referralDetails.facility",
      "label": "Facility",
      "type": "STRING"
    },
    {
      "path": "referralDetails.reason[]",
      "label": "Reason (Item)",
      "type": "STRING"
    },
    {
      "path": "referralDetails.referralNumber",
      "label": "Referral Number",
      "type": "STRING"
    },
    {
      "path": "referralDetails.referringClinician",
      "label": "Referring Clinician",
      "type": "MAP_OBJECT"
    },
    {
      "path": "referralDetails.referredToOtherCountry",
      "label": "Referred To Other Country",
      "type": "BOOLEAN"
    },
    {
      "path": "otherInformation.cancerScreening.date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerScreening.method",
      "label": "Method",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerScreening.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerScreening.results.date",
      "label": "Date",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerScreening.results.value",
      "label": "Value",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerScreening.results.code",
      "label": "Code",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerDetails[]..incidenceDate",
      "label": "Incidence Date",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerDetails[]..topography",
      "label": "Topography",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerDetails[]..morphology",
      "label": "Morphology",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerDetails[]..basisOfDiagnosis",
      "label": "Basis Of Diagnosis",
      "type": "STRING"
    },
    {
      "path": "otherInformation.cancerDetails[]..stage",
      "label": "Stage",
      "type": "STRING"
    }
  ]

  // "postnatalDetails.hivDetails.status": {
  //     label: "Mother's Overall HIV Status",
  //     path: '#{postnatalDetails.hivDetails.status}',
  //     type: 'enum',
  //     options: [
  //       { label: 'Positive', value: 'T(com.Adapter.icare.Enums.STATUS).POSITIVE' },
  //       { label: 'Negative', value: 'T(com.Adapter.icare.Enums.STATUS).NEGATIVE' },
  //       { label: 'Unknown', value: "null" }
  //     ]
  //   }


  let sample = {}

  for(let field of data){

    if(field.type === 'BOOLEAN'){
      field["options"] = [
        { label: 'True', value: true },
        { label: 'False', value: false }
      ]
    }

    if(field?.type === 'ENUM'){
      continue;
    }

    if(field?.path?.includes("[]..")){
      continue;
    }

    if(field.type === 'STRING' && (field.path?.toLowerCase()?.includes('date') || field.path?.toLowerCase()?.includes('datetime'))){
      field['type'] = 'DATE'
    }

    if(field?.options){
      sample = {
        ...sample,
        [field.path]: {
          label: field.label,
          type: field.type,
          path: `#{${field.path}}`,
          options: field.options
        },
      }
    } else {
      sample = {
        ...sample,
        [field.path]: {
          label: field.label,
          type: field.type,
          path: `#{${field.path}}`,
        },
      }
    }
  }

  return sample;
}

function isValidDateYMD(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(dateString)) {
    return false;
  }

  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > 31) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
         date.getMonth() === month - 1 &&
         date.getDate() === day;
}