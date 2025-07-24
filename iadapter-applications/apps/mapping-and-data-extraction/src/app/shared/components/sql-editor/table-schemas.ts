/**
 * FHIR Database Table Schemas
 * 
 * This file contains the comprehensive schema definitions for all FHIR views
 * extracted from the fhir-views project. These schemas are used for SQL
 * autocompletion in the SQL editor component.
 */

export interface TableSchema {
    [tableName: string]: string[];
}

export const FHIR_TABLE_SCHEMAS: TableSchema = {
    // Core FHIR Resources
    patient_flat: [
        'id', 'patient_id', 'active', 'gender', 'deceased', 'birth_date', 'marital_status',
        'organization_id', 'nida_identifier', 'identifier_type', 'identifier_value',
        'practitioner_id', 'family', 'given'
    ],
    encounter_flat: [
        'id', 'encounter_id', 'status', 'class_code', 'class_display', 'encounter_type',
        'visit_number', 'patient_id', 'period_start', 'period_end', 'referred_in',
        'new_this_year', 'new_visit', 'reportingDate', 'specialist', 'superSpecialist',
        'provided_complaints', 'complaints', 'identifier_type', 'identifier_value',
        'category', 'practitioner_id', 'organization_id', 'primary_diagnosis_id'
    ],
    condition_flat: [
        'id', 'patient_id', 'encounter_id', 'onset_datetime', 'system', 'code',
        'category', 'clinical_status'
    ],
    observation_flat: [
        'id', 'patient_id', 'encounter_id', 'status', 'obs_date', 'val_quantity',
        'val_quantity_unit', 'val_concept_text', 'val_concept_code'
    ],
    diagnosticreport_flat: [
        'id', 'encounter_id', 'effective_datetime', 'category', 'code'
    ],
    organization_flat: [
        'id', 'active', 'name', 'partOf_org_id', 'city', 'country'
    ],
    procedure_flat: [
        'id', 'encounter_id'
    ],

    // Specialized Health Views
    child_health_flat: [
        'id', 'status', 'category_code', 'category_display', 'observation_code',
        'encounter_id', 'patient_id', 'mother_start_age', 'mother_end_age'
    ],
    anc_observation_flat: [
        'id', 'encounter_id', 'patient_id', 'observation_code', 'observation_display',
        'status', 'effective_datetime', 'value_quantity', 'value_unit'
    ],
    appointment_flat: [
        'id', 'status', 'appointment_type', 'start_datetime', 'end_datetime',
        'participant_actor', 'participant_required', 'participant_status'
    ],
    billing_flat: [
        'id', 'encounter_id', 'patient_id', 'billing_code', 'billing_display',
        'quantity', 'unit_price', 'total_amount'
    ],
    birth_details_flat: [
        'id', 'encounter_id', 'patient_id', 'birth_date', 'birth_weight',
        'gestational_age', 'delivery_method', 'birth_complications'
    ],
    birth_complications_flat: [
        'id', 'encounter_id', 'patient_id', 'complication_code', 'complication_display',
        'severity', 'onset_datetime'
    ],
    admission_details_flat: [
        'id', 'encounter_id', 'patient_id', 'admission_date', 'discharge_date',
        'admission_type', 'discharge_disposition'
    ],
    caretype_flat: [
        'id', 'encounter_id', 'patient_id', 'care_type_code', 'care_type_display'
    ],
    cause_of_death_flat: [
        'id', 'patient_id', 'encounter_id', 'cause_code', 'cause_display',
        'death_date', 'death_location'
    ],
    cecap_screening_flat: [
        'id', 'encounter_id', 'patient_id', 'screening_date', 'screening_result',
        'screening_method'
    ],
    contraceptive_med_statement_flat: [
        'id', 'encounter_id', 'patient_id', 'contraceptive_type', 'start_date',
        'end_date', 'effectiveness'
    ],
    cpac_flat: [
        'id', 'encounter_id', 'patient_id', 'cpac_code', 'cpac_display'
    ],
    eye_details_flat: [
        'id', 'encounter_id', 'patient_id', 'examination_date', 'visual_acuity',
        'eye_condition', 'treatment_plan'
    ],
    family_planning_flat: [
        'id', 'encounter_id', 'patient_id', 'method_code', 'method_display',
        'start_date', 'counseling_provided'
    ],
    immunization_flat: [
        'id', 'encounter_id', 'patient_id', 'vaccine_code', 'vaccine_display',
        'vaccination_date', 'dose_number', 'route', 'site'
    ],
    labor_details_flat: [
        'id', 'encounter_id', 'patient_id', 'labor_start', 'labor_end',
        'delivery_method', 'complications'
    ],
    labor_birth_details_flat: [
        'id', 'encounter_id', 'patient_id', 'birth_datetime', 'birth_weight',
        'apgar_score', 'delivery_attendant'
    ],
    labor_family_planning_view: [
        'id', 'encounter_id', 'patient_id', 'counseling_date', 'method_discussed',
        'method_chosen', 'follow_up_date'
    ],
    medication_details_flat: [
        'id', 'encounter_id', 'patient_id', 'medication_code', 'medication_display',
        'dosage', 'frequency', 'duration'
    ],
    outcome_details_flat: [
        'id', 'encounter_id', 'patient_id', 'outcome_code', 'outcome_display',
        'outcome_date', 'severity'
    ],
    postnatal_flat: [
        'id', 'encounter_id', 'patient_id', 'visit_date', 'visit_number',
        'maternal_condition', 'infant_condition'
    ],
    postnatal_birthdetails_flat: [
        'id', 'encounter_id', 'patient_id', 'birth_date', 'birth_weight',
        'feeding_method', 'vaccination_status'
    ],
    radiology_details_flat: [
        'id', 'encounter_id', 'patient_id', 'procedure_code', 'procedure_display',
        'examination_date', 'findings', 'impression'
    ],
    referral_flat: [
        'id', 'encounter_id', 'patient_id', 'referral_date', 'referring_facility',
        'referred_to_facility', 'reason_code', 'reason_display'
    ],
    vital_observation_flat: [
        'id', 'encounter_id', 'patient_id', 'vital_sign_code', 'vital_sign_display',
        'measurement_datetime', 'value_quantity', 'value_unit'
    ]
};
