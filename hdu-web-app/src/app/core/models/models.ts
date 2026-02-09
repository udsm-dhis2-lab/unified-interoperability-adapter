export type Page =
  | 'dashboard'
  | 'client-list'
  | 'client-registration'
  | 'client-detail'
  | 'client-edit'
  | 'deduplication'
  | 'duplicate-review'
  | 'shr-dashboard'
  | 'shr-detail'
  | 'shr-integration'
  | 'referrals'
  | 'referral-detail'
  | 'appointments'
  | 'appointment-detail'
  | 'workflows'
  | 'schedules'
  | 'datasets'
  | 'workflow-config'
  | 'instances'
  | 'terminology-services'
  | 'validation'
  | 'api-management'
  | 'audit-logs'
  | 'users-list'
  | 'user-edit'
  | 'user-create'
  | 'user-roles'
  | 'user-role-edit'
  | 'user-role-create'
  | 'user-authorities'
  | 'user-authority-create'
  | 'user-profile'
  | 'user-settings'
  | 'facility-management'
  | 'facility-detail'
  | 'facility-register'
  | 'facility-edit';

export interface Client {
  id: string;
  clientId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationalId: string;
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  country: string;
  idType: string;
  alternateId?: string;
  originFacility?: {
    name: string;
    facilityId: string;
    region: string;
  };
  possibleDuplicates?: Array<{
    clientId: string;
    matchScore: number;
    matchFields: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DuplicateGroup {
  id: string;
  clients: Client[];
  matchScore: number;
  matchFields: string[];
  status: 'pending' | 'merged' | 'dismissed';
}

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
  code: string;
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
