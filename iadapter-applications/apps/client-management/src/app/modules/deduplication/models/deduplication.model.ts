export class Deduplication {
  id?: string;
  given?: string;
  family?: string;
  birthDate?: string;
  patientId?: string;
  identifiers?: Record<string, string>;
  name?: string;
  types?: string[];
  keys?: string[];
  total?: string;
  associatedDuplicates?: number;
  duplicates?: Array<{
    id: string;
    given: string;
    family: string;
    birth_date: string;
    patient_id: string;
    identifiers: Record<string, string>;
  }>;
  IdNumber?: string

  static fromJson(json: any): Deduplication {
    const deduplication = new Deduplication();
    try {
      // Handle record-level properties
      deduplication.name = json['name'] || '';
      deduplication.types = json['types'] || [];
      deduplication.keys = json['keys'] || [];
      deduplication.total = json['total'] || '0';
      deduplication.associatedDuplicates = parseInt(json['total'] || '0');

      // If there are duplicates, store them
      if (json['duplicates'] && Array.isArray(json['duplicates'])) {
        deduplication.duplicates = json['duplicates'].map((dup: any) => ({
          id: dup.id || '',
          given: dup.given || '',
          family: dup.family || '',
          birth_date: dup.birth_date || '',
          patient_id: dup.patient_id || '',
          identifiers: dup.identifiers || {}
        }));

        // For convenience, extract first duplicate's data as main properties
        if (deduplication.duplicates.length > 0) {
          const firstDup = deduplication.duplicates[0];
          deduplication.id = firstDup.id;
          deduplication.given = firstDup.given;
          deduplication.family = firstDup.family;
          deduplication.birthDate = firstDup.birth_date;
          deduplication.patientId = firstDup.patient_id;
          deduplication.identifiers = firstDup.identifiers;
        }
      }

      return deduplication;
    } catch (e) {
      console.log('Error parsing deduplication data:', e);
      return new Deduplication();
    }
  }

  // Helper method to get all MRNs from duplicates
  getAllMRNs(): string[] {
    if (!this.duplicates) return [];
    return this.duplicates.map(dup => dup.identifiers['MRN'] || '').filter(mrn => mrn !== '');
  }

  // Helper method to get all HCRCODEs from duplicates
  getAllHCRCodes(): string[] {
    if (!this.duplicates) return [];
    return this.duplicates.map(dup => dup.identifiers['HCRCODE'] || '').filter(code => code !== '');
  }

  // Format name for display
  getFullName(): string {
    if (this.given && this.family) {
      return `${this.given} ${this.family}`;
    }
    return this.name || '';
  }



  // Get gender from HCRCODE (if available)
  getGender(): string {
    const hcrCode = this.duplicates?.[0]?.identifiers['HCRCODE'] || '';
    if (hcrCode.includes('HCR-M-')) {
      return 'Male';
    } else if (hcrCode.includes('HCR-F-')) {
      return 'Female';
    }
    return 'Unknown';
  }
}
