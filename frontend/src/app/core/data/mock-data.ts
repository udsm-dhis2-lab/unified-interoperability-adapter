import type { Client, DuplicateGroup } from '../models/models';

// Health Record Types
export interface HealthEncounter {
  id: string;
  clientId: string;
  encounterId: string;
  encounterType: string;
  encounterDate: string;
  facility: {
    name: string;
    facilityId: string;
    region: string;
  };
  provider: {
    name: string;
    role: string;
  };
  chiefComplaint: string;
  diagnosis: Diagnosis[];
  medications: Medication[];
  labResults: LabResult[];
  vitals: Vitals;
  notes: string;
  syncStatus: 'synced' | 'pending' | 'error';
  lastSyncTime: string;
  fhirCompliant: boolean;
  hl7Compliant: boolean;
}

export interface Diagnosis {
  code: string; // ICD-10 code
  codeSystem: 'ICD-10' | 'SNOMED-CT';
  description: string;
  diagnosisDate: string;
  status: 'active' | 'resolved' | 'chronic';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
  pharmacySystem?: string;
}

export interface LabResult {
  id: string;
  testName: string;
  testCode: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  testDate: string;
  labSystem: string;
  technician: string;
}

export interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  bmi: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

export interface IntegrationStatus {
  systemName: string;
  systemType: 'EMR' | 'Laboratory' | 'Pharmacy' | 'Radiology' | 'National Database';
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  protocol: 'HL7' | 'FHIR' | 'REST API';
  recordsCount: number;
}

// API Endpoint Types
export interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  category: 'Client Registry' | 'Health Records' | 'Data Aggregation' | 'Synchronization';
  description: string;
  standard: 'FHIR' | 'HL7' | 'Custom';
  dataFormat: 'JSON' | 'XML' | 'Both';
  authentication: 'OAuth 2.0' | 'API Key' | 'JWT';
  requestExample: string;
  responseExample: string;
  errorCodes: ErrorCode[];
  usage24h: number;
  averageResponseTime: number;
}

export interface ErrorCode {
  code: string;
  description: string;
  troubleshooting: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
  system?: string;
}

export interface DashboardMetrics {
  totalClients: number;
  newClientsToday: number;
  newClientsThisWeek: number;
  newClientsThisMonth: number;
  totalHealthRecords: number;
  connectedSystems: number;
  apiCallsToday: number;
  dataQualityScore: number;
  clientsByFacility: { facility: string; count: number }[];
  clientsByGender: { gender: string; count: number }[];
  clientsByAge: { ageGroup: string; count: number }[];
  registrationTrend: { date: string; count: number }[];
  systemAccessLog: { system: string; accessCount: number }[];
}

export const mockClients: Client[] = [
  {
    id: '1',
    clientId: 'HCR-M-188732-01072068',
    firstName: 'Rashidi',
    middleName: 'Ayubu',
    lastName: 'Mchala',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    nationalId: '104601-0-546228/2026',
    phoneNumber: '+255712345678',
    email: 'rashidi.mchala@example.com',
    address: '123 Uhuru Street',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Muhimbili National Hospital',
      facilityId: 'FAC-001-MNH',
      region: 'Dar es Salaam',
    },
    possibleDuplicates: [
      {
        clientId: 'HCR-M-188732-01072069',
        matchScore: 95,
        matchFields: ['firstName', 'lastName', 'dateOfBirth', 'nationalId'],
      },
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    clientId: 'HCR-F-013495-17122025',
    firstName: 'Hollo',
    middleName: 'Gauja',
    lastName: 'Charles',
    dateOfBirth: '1992-03-22',
    gender: 'female',
    nationalId: '104601-0-118996/2026',
    phoneNumber: '+255723456789',
    email: 'hollo.charles@example.com',
    address: '456 Makumbusho Road',
    city: 'Arusha',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Mount Meru Regional Referral Hospital',
      facilityId: 'FAC-002-MMRRH',
      region: 'Arusha',
    },
    possibleDuplicates: [
      {
        clientId: 'HCR-F-013495-17122026',
        matchScore: 88,
        matchFields: ['firstName', 'lastName', 'phoneNumber'],
      },
    ],
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    clientId: 'HCR-M-325490-30121972',
    firstName: 'Joseph',
    middleName: 'Yolamu',
    lastName: 'Nzali',
    dateOfBirth: '1978-09-10',
    gender: 'male',
    nationalId: '104601-0-1052715/2026',
    phoneNumber: '+255734567890',
    address: '789 Kilimanjaro Avenue',
    city: 'Moshi',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Kilimanjaro Christian Medical Centre',
      facilityId: 'FAC-003-KCMC',
      region: 'Kilimanjaro',
    },
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    clientId: 'HCR-M-519234-30122025',
    firstName: 'Emmanuel',
    middleName: 'Julius',
    lastName: 'Shega',
    dateOfBirth: '1988-11-28',
    gender: 'male',
    nationalId: '104601-0-1192584/2028',
    phoneNumber: '+255745678901',
    email: 'emmanuel.shega@example.com',
    address: '321 Msasani Road',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Aga Khan Hospital',
      facilityId: 'FAC-004-AKH',
      region: 'Dar es Salaam',
    },
    possibleDuplicates: [
      {
        clientId: 'HCR-M-519234-30122026',
        matchScore: 92,
        matchFields: ['firstName', 'lastName', 'dateOfBirth'],
      },
    ],
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
  },
  {
    id: '5',
    clientId: 'HCR-M-294366-12122025',
    firstName: 'Eko',
    middleName: 'Jesca',
    lastName: 'Mwanasenga',
    dateOfBirth: '1995-04-05',
    gender: 'male',
    nationalId: '104601-0-1187072/2028',
    phoneNumber: '+255756789012',
    address: '654 Pugu Road',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Muhimbili National Hospital',
      facilityId: 'FAC-001-MNH',
      region: 'Dar es Salaam',
    },
    createdAt: '2024-01-19T13:30:00Z',
    updatedAt: '2024-01-19T13:30:00Z',
  },
  {
    id: '6',
    clientId: 'HCR-F-260341-01072000',
    firstName: 'Happy',
    middleName: 'Ditrick',
    lastName: 'Majaya',
    dateOfBirth: '1990-07-18',
    gender: 'female',
    nationalId: '104601-0-1192683/2026',
    phoneNumber: '+255767890123',
    email: 'happy.majaya@example.com',
    address: '987 Tegeta Street',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Mwananyamala Regional Referral Hospital',
      facilityId: 'FAC-005-MRRH',
      region: 'Dar es Salaam',
    },
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: '7',
    clientId: 'HCR-F-985046-01072004',
    firstName: 'Valentina',
    middleName: 'Agatoni',
    lastName: 'Ndungulu',
    dateOfBirth: '1987-12-03',
    gender: 'female',
    nationalId: '104601-0-1192582/2026',
    phoneNumber: '+255778901234',
    address: '147 Mwenge Area',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Temeke Regional Referral Hospital',
      facilityId: 'FAC-006-TRRH',
      region: 'Dar es Salaam',
    },
    createdAt: '2024-01-21T16:20:00Z',
    updatedAt: '2024-01-21T16:20:00Z',
  },
  {
    id: '8',
    clientId: 'HCR-F-634709-01072008',
    firstName: 'Lisa',
    middleName: 'Elisai',
    lastName: 'Lukumay',
    dateOfBirth: '1993-08-25',
    gender: 'female',
    nationalId: '104601-0-1192579/2026',
    phoneNumber: '+255789012345',
    email: 'lisa.lukumay@example.com',
    address: '258 Mbezi Beach',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    idType: 'MRN',
    createdAt: '2024-01-22T08:40:00Z',
    updatedAt: '2024-01-22T08:40:00Z',
  },
  {
    id: '9',
    clientId: 'HCR-M-640257-07122016',
    firstName: 'Emmanuel',
    middleName: 'Shija',
    lastName: 'Ngasa',
    dateOfBirth: '1991-02-14',
    gender: 'male',
    nationalId: '104601-0-1043280/2026',
    phoneNumber: '+255790123456',
    address: '369 Kinondoni Road',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Amana Regional Referral Hospital',
      facilityId: 'FAC-007-ARRH',
      region: 'Dar es Salaam',
    },
    createdAt: '2024-01-23T10:10:00Z',
    updatedAt: '2024-01-23T10:10:00Z',
  },
  {
    id: '10',
    clientId: 'HCR-F-120954-07071995',
    firstName: 'Mariam',
    middleName: 'Thobbias',
    lastName: 'Lyandi',
    dateOfBirth: '1989-05-30',
    gender: 'female',
    nationalId: '104601-0-1097117/2026',
    phoneNumber: '+255701234567',
    email: 'mariam.lyandi@example.com',
    address: '741 Mikocheni',
    city: 'Dar es Salaam',
    country: 'Tanzania',
    idType: 'MRN',
    originFacility: {
      name: 'Ocean Road Cancer Institute',
      facilityId: 'FAC-008-ORCI',
      region: 'Dar es Salaam',
    },
    createdAt: '2024-01-24T12:25:00Z',
    updatedAt: '2024-01-24T12:25:00Z',
  },
];

export const mockDuplicateGroups: DuplicateGroup[] = [
  {
    id: 'dup-1',
    clients: [mockClients[0], {
      ...mockClients[0],
      id: '11',
      clientId: 'HCR-M-188732-01072069',
      phoneNumber: '+255712345679',
      address: '124 Uhuru Street',
    }],
    matchScore: 95,
    matchFields: ['firstName', 'lastName', 'dateOfBirth', 'nationalId'],
    status: 'pending',
  },
  {
    id: 'dup-2',
    clients: [mockClients[1], {
      ...mockClients[1],
      id: '12',
      clientId: 'HCR-F-013495-17122026',
      email: 'h.charles@example.com',
      phoneNumber: '+255723456780',
    }],
    matchScore: 88,
    matchFields: ['firstName', 'lastName', 'phoneNumber'],
    status: 'pending',
  },
  {
    id: 'dup-3',
    clients: [mockClients[3], {
      ...mockClients[3],
      id: '13',
      clientId: 'HCR-M-519234-30122026',
      middleName: 'J.',
      address: '322 Msasani Road',
    }],
    matchScore: 92,
    matchFields: ['firstName', 'lastName', 'dateOfBirth'],
    status: 'pending',
  },
];

// Mock Health Encounters
export const mockHealthEncounters: HealthEncounter[] = [
  {
    id: 'enc-1',
    clientId: '1',
    encounterId: 'ENC-2024-001-MNH',
    encounterType: 'Outpatient Visit',
    encounterDate: '2024-01-20T09:00:00Z',
    facility: {
      name: 'Muhimbili National Hospital',
      facilityId: 'FAC-001-MNH',
      region: 'Dar es Salaam',
    },
    provider: {
      name: 'Dr. Amina Bakari',
      role: 'General Practitioner',
    },
    chiefComplaint: 'Persistent headache and fever for 3 days',
    diagnosis: [
      {
        code: 'J06.9',
        codeSystem: 'ICD-10',
        description: 'Acute upper respiratory infection, unspecified',
        diagnosisDate: '2024-01-20',
        status: 'active',
      },
    ],
    medications: [
      {
        id: 'med-1',
        name: 'Paracetamol 500mg',
        dosage: '500mg',
        frequency: '3 times daily',
        startDate: '2024-01-20',
        endDate: '2024-01-27',
        prescribedBy: 'Dr. Amina Bakari',
        status: 'active',
        pharmacySystem: 'MNH Pharmacy System',
      },
      {
        id: 'med-2',
        name: 'Amoxicillin 250mg',
        dosage: '250mg',
        frequency: '2 times daily',
        startDate: '2024-01-20',
        endDate: '2024-01-27',
        prescribedBy: 'Dr. Amina Bakari',
        status: 'active',
        pharmacySystem: 'MNH Pharmacy System',
      },
    ],
    labResults: [
      {
        id: 'lab-1',
        testName: 'Complete Blood Count',
        testCode: 'CBC-001',
        result: '12.5',
        unit: 'g/dL',
        referenceRange: '12-16 g/dL',
        status: 'normal',
        testDate: '2024-01-20T10:30:00Z',
        labSystem: 'MNH Laboratory Information System',
        technician: 'John Mwamba',
      },
      {
        id: 'lab-2',
        testName: 'White Blood Cell Count',
        testCode: 'WBC-001',
        result: '11000',
        unit: 'cells/μL',
        referenceRange: '4000-11000 cells/μL',
        status: 'normal',
        testDate: '2024-01-20T10:30:00Z',
        labSystem: 'MNH Laboratory Information System',
        technician: 'John Mwamba',
      },
    ],
    vitals: {
      bloodPressure: '120/80',
      heartRate: 78,
      temperature: 38.2,
      weight: 75,
      height: 175,
      bmi: 24.5,
      respiratoryRate: 18,
      oxygenSaturation: 98,
    },
    notes: 'Patient advised to rest and complete antibiotic course. Follow-up in 7 days if symptoms persist.',
    syncStatus: 'synced',
    lastSyncTime: '2024-01-20T09:30:00Z',
    fhirCompliant: true,
    hl7Compliant: true,
  },
  {
    id: 'enc-2',
    clientId: '1',
    encounterId: 'ENC-2023-089-MNH',
    encounterType: 'Annual Checkup',
    encounterDate: '2023-12-10T14:00:00Z',
    facility: {
      name: 'Muhimbili National Hospital',
      facilityId: 'FAC-001-MNH',
      region: 'Dar es Salaam',
    },
    provider: {
      name: 'Dr. Hassan Mkumbwa',
      role: 'Physician',
    },
    chiefComplaint: 'Annual physical examination',
    diagnosis: [
      {
        code: 'Z00.00',
        codeSystem: 'ICD-10',
        description: 'Encounter for general adult medical examination without abnormal findings',
        diagnosisDate: '2023-12-10',
        status: 'resolved',
      },
    ],
    medications: [],
    labResults: [
      {
        id: 'lab-3',
        testName: 'Fasting Blood Sugar',
        testCode: 'FBS-001',
        result: '95',
        unit: 'mg/dL',
        referenceRange: '70-100 mg/dL',
        status: 'normal',
        testDate: '2023-12-10T08:00:00Z',
        labSystem: 'MNH Laboratory Information System',
        technician: 'Mary Kimaro',
      },
      {
        id: 'lab-4',
        testName: 'Total Cholesterol',
        testCode: 'CHOL-001',
        result: '185',
        unit: 'mg/dL',
        referenceRange: '<200 mg/dL',
        status: 'normal',
        testDate: '2023-12-10T08:00:00Z',
        labSystem: 'MNH Laboratory Information System',
        technician: 'Mary Kimaro',
      },
    ],
    vitals: {
      bloodPressure: '118/75',
      heartRate: 72,
      temperature: 36.8,
      weight: 73,
      height: 175,
      bmi: 23.8,
      respiratoryRate: 16,
      oxygenSaturation: 99,
    },
    notes: 'Patient in good health. Continue healthy lifestyle. Next checkup in 12 months.',
    syncStatus: 'synced',
    lastSyncTime: '2023-12-10T14:30:00Z',
    fhirCompliant: true,
    hl7Compliant: true,
  },
  {
    id: 'enc-3',
    clientId: '2',
    encounterId: 'ENC-2024-012-MMRRH',
    encounterType: 'Emergency Visit',
    encounterDate: '2024-01-18T22:30:00Z',
    facility: {
      name: 'Mount Meru Regional Referral Hospital',
      facilityId: 'FAC-002-MMRRH',
      region: 'Arusha',
    },
    provider: {
      name: 'Dr. Grace Moshi',
      role: 'Emergency Medicine Specialist',
    },
    chiefComplaint: 'Severe abdominal pain',
    diagnosis: [
      {
        code: 'K35.80',
        codeSystem: 'ICD-10',
        description: 'Acute appendicitis',
        diagnosisDate: '2024-01-18',
        status: 'resolved',
      },
    ],
    medications: [
      {
        id: 'med-3',
        name: 'Morphine',
        dosage: '5mg',
        frequency: 'As needed for pain',
        startDate: '2024-01-18',
        prescribedBy: 'Dr. Grace Moshi',
        status: 'completed',
        pharmacySystem: 'MMRRH Pharmacy',
      },
    ],
    labResults: [
      {
        id: 'lab-5',
        testName: 'White Blood Cell Count',
        testCode: 'WBC-002',
        result: '15000',
        unit: 'cells/μL',
        referenceRange: '4000-11000 cells/μL',
        status: 'abnormal',
        testDate: '2024-01-18T23:00:00Z',
        labSystem: 'MMRRH Lab System',
        technician: 'James Lyimo',
      },
    ],
    vitals: {
      bloodPressure: '135/85',
      heartRate: 95,
      temperature: 38.5,
      weight: 65,
      height: 165,
      bmi: 23.9,
      respiratoryRate: 20,
      oxygenSaturation: 97,
    },
    notes: 'Emergency appendectomy performed. Patient stable post-surgery. Discharge in 3 days.',
    syncStatus: 'synced',
    lastSyncTime: '2024-01-19T02:00:00Z',
    fhirCompliant: true,
    hl7Compliant: true,
  },
];

// Mock Integration Status
export const mockIntegrationStatus: IntegrationStatus[] = [
  {
    systemName: 'Muhimbili National Hospital EMR',
    systemType: 'EMR',
    status: 'connected',
    lastSync: '2024-01-27T08:30:00Z',
    protocol: 'FHIR',
    recordsCount: 2456,
  },
  {
    systemName: 'MNH Laboratory Information System',
    systemType: 'Laboratory',
    status: 'connected',
    lastSync: '2024-01-27T08:25:00Z',
    protocol: 'HL7',
    recordsCount: 1834,
  },
  {
    systemName: 'MNH Pharmacy Management System',
    systemType: 'Pharmacy',
    status: 'connected',
    lastSync: '2024-01-27T08:20:00Z',
    protocol: 'REST API',
    recordsCount: 3102,
  },
  {
    systemName: 'Mount Meru Hospital EMR',
    systemType: 'EMR',
    status: 'connected',
    lastSync: '2024-01-27T07:45:00Z',
    protocol: 'FHIR',
    recordsCount: 1567,
  },
  {
    systemName: 'KCMC Radiology System',
    systemType: 'Radiology',
    status: 'syncing',
    lastSync: '2024-01-27T06:30:00Z',
    protocol: 'HL7',
    recordsCount: 892,
  },
  {
    systemName: 'Tanzania National Health Database',
    systemType: 'National Database',
    status: 'connected',
    lastSync: '2024-01-27T08:00:00Z',
    protocol: 'FHIR',
    recordsCount: 12453,
  },
  {
    systemName: 'Aga Khan Hospital EMR',
    systemType: 'EMR',
    status: 'connected',
    lastSync: '2024-01-27T08:15:00Z',
    protocol: 'FHIR',
    recordsCount: 987,
  },
];
