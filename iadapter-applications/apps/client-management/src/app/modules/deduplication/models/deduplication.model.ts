export class Deduplication {
  id?: string;
  given?: string;
  family?: string;
  birthDate?: string;
  patientId?: string;
  middleName?: string;
  firstName?: string;
  surname?: string;
  identifiers?: Record<string, string>;
  name?: string;
  gender?: string;
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

  static fromJson(json: any): Deduplication {
    const deduplication = new Deduplication();
    Object.keys(json).forEach((key) => {
      (deduplication as any)[key] = json[key];
    });
    return deduplication;
  }

  // Helper method to get all MRNs from duplicates
  getAllMRNs(): string[] {
    if (!this.duplicates) return [];
    return this.duplicates
      .map((dup) => dup.identifiers['MRN'] || '')
      .filter((mrn) => mrn !== '');
  }

  // Helper method to get all HCRCODEs from duplicates
  getAllHCRCodes(): string[] {
    if (!this.duplicates) return [];
    return this.duplicates
      .map((dup) => dup.identifiers['HCRCODE'] || '')
      .filter((code) => code !== '');
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
