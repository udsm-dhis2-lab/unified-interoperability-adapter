import type { APIEndpoint, AuditLog, DashboardMetrics } from '../models/models';

// Mock API Endpoints
export const mockAPIEndpoints: APIEndpoint[] = [
  {
    id: 'api-1',
    name: 'Get Client by ID',
    method: 'GET',
    endpoint: '/api/v1/clients/{clientId}',
    category: 'Client Registry',
    description: 'Retrieve client demographic information by unique client ID',
    standard: 'FHIR',
    dataFormat: 'JSON',
    authentication: 'OAuth 2.0',
    requestExample: `GET /api/v1/clients/HCR-M-188732-01072068
Headers:
  Authorization: Bearer {access_token}
  Accept: application/fhir+json`,
    responseExample: `{
  "resourceType": "Patient",
  "id": "HCR-M-188732-01072068",
  "identifier": [{"system": "https://hdmis.go.tz/client-id", "value": "HCR-M-188732-01072068"}],
  "name": [{"family": "Mchala", "given": ["Rashidi", "Ayubu"]}],
  "gender": "male",
  "birthDate": "1985-06-15",
  "telecom": [{"system": "phone", "value": "+255712345678"}]
}`,
    errorCodes: [
      { code: 'CR001', description: 'Client not found', troubleshooting: 'Verify the client ID and try again' },
      { code: 'AUTH001', description: 'Invalid authentication token', troubleshooting: 'Refresh the access token and retry' },
    ],
    usage24h: 1245,
    averageResponseTime: 145,
  },
  {
    id: 'api-2',
    name: 'Search Clients',
    method: 'GET',
    endpoint: '/api/v1/clients/search',
    category: 'Client Registry',
    description: 'Search for clients using various parameters (name, DOB, national ID, etc.)',
    standard: 'FHIR',
    dataFormat: 'JSON',
    authentication: 'OAuth 2.0',
    requestExample: `GET /api/v1/clients/search?family=Mchala&given=Rashidi&birthdate=1985-06-15
Headers:
  Authorization: Bearer {access_token}
  Accept: application/fhir+json`,
    responseExample: `{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 1,
  "entry": [{
    "resource": {
      "resourceType": "Patient",
      "id": "HCR-M-188732-01072068",
      "name": [{"family": "Mchala", "given": ["Rashidi", "Ayubu"]}]
    }
  }]
}`,
    errorCodes: [
      { code: 'CR002', description: 'Invalid search parameters', troubleshooting: 'Check the parameter format and try again' },
      { code: 'CR003', description: 'Too many results', troubleshooting: 'Refine your search criteria to narrow results' },
    ],
    usage24h: 2567,
    averageResponseTime: 234,
  },
  {
    id: 'api-3',
    name: 'Update Client',
    method: 'PUT',
    endpoint: '/api/v1/clients/{clientId}',
    category: 'Client Registry',
    description: 'Update client demographic information across connected systems',
    standard: 'FHIR',
    dataFormat: 'JSON',
    authentication: 'OAuth 2.0',
    requestExample: `PUT /api/v1/clients/HCR-M-188732-01072068
Headers:
  Authorization: Bearer {access_token}
  Content-Type: application/fhir+json
Body:
{
  "resourceType": "Patient",
  "id": "HCR-M-188732-01072068",
  "telecom": [{"system": "phone", "value": "+255712345999"}]
}`,
    responseExample: `{
  "resourceType": "Patient",
  "id": "HCR-M-188732-01072068",
  "meta": {"lastUpdated": "2024-01-27T10:30:00Z"},
  "syncStatus": "synced",
  "syncedSystems": 5
}`,
    errorCodes: [
      { code: 'CR004', description: 'Update failed', troubleshooting: 'Check data format and required fields' },
      { code: 'CR005', description: 'Sync error', troubleshooting: 'Some systems may be offline. Data will sync when available' },
    ],
    usage24h: 456,
    averageResponseTime: 678,
  },
  {
    id: 'api-4',
    name: 'Get Health Records',
    method: 'GET',
    endpoint: '/api/v1/health-records/{clientId}',
    category: 'Health Records',
    description: 'Retrieve complete health records for a client from selected hospitals',
    standard: 'FHIR',
    dataFormat: 'JSON',
    authentication: 'OAuth 2.0',
    requestExample: `GET /api/v1/health-records/HCR-M-188732-01072068?facilities=FAC-001-MNH,FAC-002-MMRRH
Headers:
  Authorization: Bearer {access_token}
  Accept: application/fhir+json`,
    responseExample: `{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {"resource": {"resourceType": "Encounter", "id": "ENC-2024-001-MNH"}},
    {"resource": {"resourceType": "Condition", "code": {"coding": [{"system": "ICD-10", "code": "J06.9"}]}}},
    {"resource": {"resourceType": "MedicationStatement", "medicationCodeableConcept": {"text": "Paracetamol 500mg"}}}
  ]
}`,
    errorCodes: [
      { code: 'HR001', description: 'No health records found', troubleshooting: 'Client may not have visited selected facilities' },
      { code: 'HR002', description: 'Access denied', troubleshooting: 'Check user permissions for facility access' },
    ],
    usage24h: 3421,
    averageResponseTime: 456,
  },
  {
    id: 'api-5',
    name: 'Update Health Record',
    method: 'PUT',
    endpoint: '/api/v1/health-records/{encounterId}',
    category: 'Health Records',
    description: 'Update health record information with two-way synchronization',
    standard: 'FHIR',
    dataFormat: 'JSON',
    authentication: 'OAuth 2.0',
    requestExample: `PUT /api/v1/health-records/ENC-2024-001-MNH
Headers:
  Authorization: Bearer {access_token}
  Content-Type: application/fhir+json
Body:
{
  "resourceType": "Encounter",
  "id": "ENC-2024-001-MNH",
  "status": "completed",
  "note": [{"text": "Follow-up completed. Patient recovered."}]
}`,
    responseExample: `{
  "resourceType": "Encounter",
  "id": "ENC-2024-001-MNH",
  "meta": {"lastUpdated": "2024-01-27T10:45:00Z"},
  "syncStatus": "synced"
}`,
    errorCodes: [
      { code: 'HR003', description: 'Update not allowed', troubleshooting: 'Only source facility can update records' },
      { code: 'HR004', description: 'Validation error', troubleshooting: 'Check required FHIR fields' },
    ],
    usage24h: 892,
    averageResponseTime: 523,
  },
  {
    id: 'api-6',
    name: 'Aggregate Data Query',
    method: 'POST',
    endpoint: '/api/v1/aggregation/query',
    category: 'Data Aggregation',
    description: 'Query aggregated data from multiple facilities with filtering',
    standard: 'Custom',
    dataFormat: 'JSON',
    authentication: 'OAuth 2.0',
    requestExample: `POST /api/v1/aggregation/query
Headers:
  Authorization: Bearer {access_token}
  Content-Type: application/json
Body:
{
  "metric": "client_registrations",
  "facilities": ["FAC-001-MNH", "FAC-002-MMRRH"],
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "groupBy": "facility"
}`,
    responseExample: `{
  "metric": "client_registrations",
  "period": "2024-01-01 to 2024-01-31",
  "data": [
    {"facility": "FAC-001-MNH", "count": 1245, "percentage": 55},
    {"facility": "FAC-002-MMRRH", "count": 1023, "percentage": 45}
  ],
  "total": 2268
}`,
    errorCodes: [
      { code: 'AGG001', description: 'Invalid date range', troubleshooting: 'Ensure start date is before end date' },
      { code: 'AGG002', description: 'Facility not found', troubleshooting: 'Verify facility IDs' },
    ],
    usage24h: 678,
    averageResponseTime: 1245,
  },
  {
    id: 'api-7',
    name: 'Sync Client Data',
    method: 'POST',
    endpoint: '/api/v1/sync/client',
    category: 'Synchronization',
    description: 'Synchronize client data bidirectionally between systems',
    standard: 'FHIR',
    dataFormat: 'Both',
    authentication: 'JWT',
    requestExample: `POST /api/v1/sync/client
Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/fhir+json
Body:
{
  "resourceType": "Patient",
  "identifier": [{"system": "facility-id", "value": "LOCAL-12345"}],
  "sourceSystem": "FAC-001-MNH",
  "syncMode": "bidirectional"
}`,
    responseExample: `{
  "syncStatus": "success",
  "clientId": "HCR-M-188732-01072068",
  "systemsSynced": ["FAC-001-MNH", "FAC-002-MMRRH", "National Database"],
  "syncTime": "2024-01-27T10:50:00Z"
}`,
    errorCodes: [
      { code: 'SYNC001', description: 'Sync conflict detected', troubleshooting: 'Resolve data conflicts manually' },
      { code: 'SYNC002', description: 'System unavailable', troubleshooting: 'One or more systems are offline. Will retry automatically' },
    ],
    usage24h: 1567,
    averageResponseTime: 892,
  },
  {
    id: 'api-8',
    name: 'Sync Health Records',
    method: 'POST',
    endpoint: '/api/v1/sync/health-records',
    category: 'Synchronization',
    description: 'Synchronize health records across connected healthcare systems',
    standard: 'FHIR',
    dataFormat: 'Both',
    authentication: 'JWT',
    requestExample: `POST /api/v1/sync/health-records
Headers:
  Authorization: Bearer {jwt_token}
  Content-Type: application/fhir+json
Body:
{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {"resource": {"resourceType": "Encounter", "subject": {"reference": "Patient/HCR-M-188732-01072068"}}}
  ]
}`,
    responseExample: `{
  "syncStatus": "success",
  "recordsSynced": 5,
  "systemsSynced": ["EMR", "Laboratory", "Pharmacy"],
  "syncTime": "2024-01-27T11:00:00Z"
}`,
    errorCodes: [
      { code: 'SYNC003', description: 'Partial sync', troubleshooting: 'Some records synced successfully, others failed' },
      { code: 'SYNC004', description: 'Format error', troubleshooting: 'Check FHIR resource structure' },
    ],
    usage24h: 2134,
    averageResponseTime: 1456,
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    timestamp: '2024-01-27T10:30:00Z',
    userId: 'user-001',
    userName: 'Dr. Amina Bakari',
    userRole: 'Health Professional',
    action: 'VIEW',
    resource: 'Client Record',
    resourceId: 'HCR-M-188732-01072068',
    ipAddress: '196.13.45.123',
    status: 'success',
    details: 'Viewed complete client demographic information',
    system: 'Muhimbili National Hospital EMR',
  },
  {
    id: 'audit-2',
    timestamp: '2024-01-27T10:25:00Z',
    userId: 'user-002',
    userName: 'Dr. Hassan Mkumbwa',
    userRole: 'Health Professional',
    action: 'VIEW',
    resource: 'Health Records',
    resourceId: 'HCR-F-013495-17122025',
    ipAddress: '196.13.45.124',
    status: 'success',
    details: 'Accessed health records from 2 facilities',
    system: 'Mount Meru Hospital EMR',
  },
  {
    id: 'audit-3',
    timestamp: '2024-01-27T10:20:00Z',
    userId: 'system-001',
    userName: 'API Integration Service',
    userRole: 'System',
    action: 'UPDATE',
    resource: 'Client Record',
    resourceId: 'HCR-M-325490-30121972',
    ipAddress: '10.0.1.45',
    status: 'success',
    details: 'Updated phone number via API. Synced to 5 systems.',
    system: 'Health Data Universal API',
  },
  {
    id: 'audit-4',
    timestamp: '2024-01-27T10:15:00Z',
    userId: 'user-003',
    userName: 'Mary Kimaro',
    userRole: 'Laboratory Technician',
    action: 'CREATE',
    resource: 'Lab Result',
    resourceId: 'lab-5',
    ipAddress: '196.13.45.125',
    status: 'success',
    details: 'Added new lab result for Complete Blood Count',
    system: 'MNH Laboratory Information System',
  },
  {
    id: 'audit-5',
    timestamp: '2024-01-27T10:10:00Z',
    userId: 'user-004',
    userName: 'John Mwamba',
    userRole: 'Data Analyst',
    action: 'EXPORT',
    resource: 'Dashboard Data',
    resourceId: 'dashboard-export-001',
    ipAddress: '196.13.45.126',
    status: 'success',
    details: 'Exported client registration data to CSV format',
  },
  {
    id: 'audit-6',
    timestamp: '2024-01-27T10:05:00Z',
    userId: 'user-005',
    userName: 'Grace Moshi',
    userRole: 'Health Professional',
    action: 'VIEW',
    resource: 'API Documentation',
    resourceId: 'api-docs',
    ipAddress: '196.13.45.127',
    status: 'success',
    details: 'Accessed API endpoint documentation',
  },
  {
    id: 'audit-7',
    timestamp: '2024-01-27T10:00:00Z',
    userId: 'system-002',
    userName: 'Sync Service',
    userRole: 'System',
    action: 'SYNC',
    resource: 'Health Records',
    resourceId: 'bulk-sync-001',
    ipAddress: '10.0.1.46',
    status: 'success',
    details: 'Synchronized 150 health records from National Database',
    system: 'Tanzania National Health Database',
  },
  {
    id: 'audit-8',
    timestamp: '2024-01-27T09:55:00Z',
    userId: 'user-001',
    userName: 'Dr. Amina Bakari',
    userRole: 'Health Professional',
    action: 'UPDATE',
    resource: 'Health Record',
    resourceId: 'ENC-2024-001-MNH',
    ipAddress: '196.13.45.123',
    status: 'failed',
    details: 'Update failed: Only source facility can modify records',
  },
  {
    id: 'audit-9',
    timestamp: '2024-01-27T09:50:00Z',
    userId: 'user-006',
    userName: 'James Lyimo',
    userRole: 'Administrator',
    action: 'VIEW',
    resource: 'Audit Logs',
    resourceId: 'audit-logs',
    ipAddress: '196.13.45.128',
    status: 'success',
    details: 'Reviewed system audit logs for security compliance',
  },
  {
    id: 'audit-10',
    timestamp: '2024-01-27T09:45:00Z',
    userId: 'user-007',
    userName: 'Lisa Lukumay',
    userRole: 'Data Analyst',
    action: 'VIEW',
    resource: 'Dashboard',
    resourceId: 'analytics-dashboard',
    ipAddress: '196.13.45.129',
    status: 'success',
    details: 'Accessed centralized analytics dashboard',
  },
  {
    id: 'audit-11',
    timestamp: '2024-01-27T09:40:00Z',
    userId: 'system-003',
    userName: 'API Gateway',
    userRole: 'System',
    action: 'API_CALL',
    resource: 'Client Search',
    resourceId: 'api-2',
    ipAddress: '10.0.1.47',
    status: 'success',
    details: 'API call: Search clients by name and DOB',
    system: 'External Integration',
  },
  {
    id: 'audit-12',
    timestamp: '2024-01-27T09:35:00Z',
    userId: 'user-008',
    userName: 'Emmanuel Shega',
    userRole: 'Pharmacist',
    action: 'VIEW',
    resource: 'Medication History',
    resourceId: 'HCR-M-519234-30122025',
    ipAddress: '196.13.45.130',
    status: 'success',
    details: 'Reviewed medication history before prescription',
    system: 'MNH Pharmacy Management System',
  },
];

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalClients: 10,
  newClientsToday: 3,
  newClientsThisWeek: 15,
  newClientsThisMonth: 67,
  totalHealthRecords: 245,
  connectedSystems: 7,
  apiCallsToday: 15234,
  dataQualityScore: 96.5,
  clientsByFacility: [
    { facility: 'Muhimbili National Hospital', count: 3 },
    { facility: 'Mount Meru Regional Referral Hospital', count: 1 },
    { facility: 'Kilimanjaro Christian Medical Centre', count: 1 },
    { facility: 'Aga Khan Hospital', count: 1 },
    { facility: 'Mwananyamala Regional Referral Hospital', count: 1 },
    { facility: 'Temeke Regional Referral Hospital', count: 1 },
    { facility: 'Amana Regional Referral Hospital', count: 1 },
    { facility: 'Ocean Road Cancer Institute', count: 1 },
  ],
  clientsByGender: [
    { gender: 'Male', count: 5 },
    { gender: 'Female', count: 5 },
  ],
  clientsByAge: [
    { ageGroup: '0-17', count: 0 },
    { ageGroup: '18-30', count: 2 },
    { ageGroup: '31-45', count: 5 },
    { ageGroup: '46-60', count: 2 },
    { ageGroup: '61+', count: 1 },
  ],
  registrationTrend: [
    { date: '2024-01-15', count: 1 },
    { date: '2024-01-16', count: 1 },
    { date: '2024-01-17', count: 1 },
    { date: '2024-01-18', count: 1 },
    { date: '2024-01-19', count: 1 },
    { date: '2024-01-20', count: 1 },
    { date: '2024-01-21', count: 1 },
    { date: '2024-01-22', count: 1 },
    { date: '2024-01-23', count: 1 },
    { date: '2024-01-24', count: 1 },
    { date: '2024-01-25', count: 0 },
    { date: '2024-01-26', count: 0 },
    { date: '2024-01-27', count: 3 },
  ],
  systemAccessLog: [
    { system: 'Muhimbili National Hospital EMR', accessCount: 234 },
    { system: 'Mount Meru Hospital EMR', accessCount: 156 },
    { system: 'KCMC EMR', accessCount: 123 },
    { system: 'MNH Laboratory System', accessCount: 189 },
    { system: 'MNH Pharmacy System', accessCount: 145 },
    { system: 'National Health Database', accessCount: 456 },
    { system: 'External API Integrations', accessCount: 234 },
  ],
};
