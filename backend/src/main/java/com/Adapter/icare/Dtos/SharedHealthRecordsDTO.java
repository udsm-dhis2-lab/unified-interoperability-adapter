package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SharedHealthRecordsDTO {

    @NotNull(message = "value cannot be null")
    private String mrn;

    @NotNull(message = "value cannot be null")
    private FacilityDetailsDTO facilityDetails;

//    @NotNull(message = "value cannot be null")
    private ReportDetailsDTO reportDetails;
    private DemographicDetailsDTO demographicDetails;

    private List<PaymentDetailsDTO> paymentDetails;

    @NotNull(message = "value cannot be null")
    private VisitDetailsDTO visitDetails;

    private ClinicalInformationDTO clinicalInformation;

    private List<AllergiesDTO> allergies;

    private List<ChronicConditionsDTO> chronicConditions;

    private LifeStyleInformationDTO lifeStyleInformation;

    private List<InvestigationDetailsDTO> investigationDetails;

    private List<LabInvestigationDetailsDTO> labInvestigationDetails;

    private List<DiagnosisDetailsDTO> diagnosisDetails;

    private List<MedicationDetailsDTO> medicationDetails;

    private TreatmentDetailsDTO treatmentDetails;

    private List<RadiologyDetailsDTO> radiologyDetails;

    private AdmissionDetailsDTO admissionDetails;

    private OutcomeDetailsDTO outcomeDetails;

    private CausesOfDeathDetailsDTO causesOfDeathDetails;

    private List<BillingsDetailsDTO> billingsDetails;

    private VisitMainPaymentDetailsDTO visitMainPaymentDetails;

    private OtherInformationDTO otherInformation;

    private ReferralDetailsDTO referralDetails;

    public Map<String,Object> toMap() {
        Map<String,Object> sharedRecordMap = new HashMap<>();
        sharedRecordMap.put("facilityDetails", this.getFacilityDetails());
        sharedRecordMap.put("reportingDetails", this.getReportDetails());
        sharedRecordMap.put("demographicDetails", this.getDemographicDetails());
        sharedRecordMap.put("visitDetails", this.getVisitDetails());
        sharedRecordMap.put("clinicalInformation", this.getClinicalInformation());
        return  sharedRecordMap;
    }
}
