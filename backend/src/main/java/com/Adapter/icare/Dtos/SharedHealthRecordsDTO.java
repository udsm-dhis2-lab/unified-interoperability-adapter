package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SharedHealthRecordsDTO {

//    @NotNull(message = "value cannot be null")
    private String mrn;

//    @NotNull(message = "value cannot be null")
    private FacilityDetailsDTO facilityDetails;

//    @NotNull(message = "value cannot be null")
    private ReportDetailsDTO reportDetails;

    @Valid
    private DemographicDetailsDTO demographicDetails;

    private List<PaymentDetailsDTO> paymentDetails;

    @NotNull(message = "value cannot be null")
    private VisitDetailsDTO visitDetails;

    private SelfMonitoringClinicalInformationDTO selfMonitoringClinicalInformation;

    private List<AppointmentDetailsDTO> appointment;

    private ClinicalInformationDTO clinicalInformation;

    private List<AllergiesDTO> allergies;

    private List<ChronicConditionsDTO> chronicConditions;

    private LifeStyleInformationDTO lifeStyleInformation;

    private List<InvestigationDetailsDTO> investigationDetails;

    private List<LabInvestigationDetailsDTO> labInvestigationDetails;

    private List<DiagnosisDetailsDTO> diagnosisDetails;

    private List<MedicationDetailsDTO> medicationDetails;

    private TreatmentDetailsDTO treatmentDetails;

    private EyeClinicDetailsDTO eyeClinicDetails;

    private List<RadiologyDetailsDTO> radiologyDetails;

    private AdmissionDetailsDTO admissionDetails;

    @NotNull(message = "Outcome details block cannot be null")
    @Valid
    private OutcomeDetailsDTO outcomeDetails;

    private CausesOfDeathDetailsDTO causesOfDeathDetails;

    private AntenatalCareDetailsDTO antenatalCareDetails;

    private LaborAndDeliveryDetailsDTO laborAndDeliveryDetails;

    private PostnatalDetailsDTO postnatalDetails;

    private List<ProphylAxisDetailsDTO> prophylAxisDetails;

    private List<VaccinationDetailsDTO> vaccinationDetails;

    private FamilyPlanningDetailsDTO familyPlanningDetails;

    private ChildHealthDetailsDTO childHealthDetails;

    private CpacDetailsDTO cpacDetails;

    private List<BillingsDetailsDTO> billingsDetails;

    private VisitMainPaymentDetailsDTO visitMainPaymentDetails;

    private ReferralDetailsDTO referralDetails;

    private OtherInformationDTO otherInformation;

    public Map<String,Object> toMap() {
        Map<String,Object> sharedRecordMap = new LinkedHashMap<>();
        sharedRecordMap.put("facilityDetails", this.getFacilityDetails());
        sharedRecordMap.put("reportingDetails", this.getReportDetails());
        sharedRecordMap.put("mrn", this.getMrn());
        sharedRecordMap.put("demographicDetails", this.getDemographicDetails().toMap());
        sharedRecordMap.put("visitDetails", this.getVisitDetails());
        sharedRecordMap.put("clinicalInformation", this.getClinicalInformation());
        sharedRecordMap.put("allergies", this.getAllergies());
        sharedRecordMap.put("chronicConditions", this.getChronicConditions());
        sharedRecordMap.put("lifeStyleInformation", this.getLifeStyleInformation());
        sharedRecordMap.put("investigationDetails", this.getInvestigationDetails());
        sharedRecordMap.put("labInvestigationDetails", this.getLabInvestigationDetails());
        sharedRecordMap.put("diagnosisDetails", this.getDiagnosisDetails());
        sharedRecordMap.put("medicationDetails", this.getMedicationDetails());
        sharedRecordMap.put("treatmentDetails", this.getTreatmentDetails());
        sharedRecordMap.put("radiologyDetails", this.getRadiologyDetails());
        sharedRecordMap.put("admissionDetails", this.getAdmissionDetails());
        sharedRecordMap.put("outcomeDetails", this.getOutcomeDetails());
        sharedRecordMap.put("causesOfDeathDetails", this.getCausesOfDeathDetails());
        sharedRecordMap.put("antenatalCareDetails", this.getAntenatalCareDetails());
        sharedRecordMap.put("prophylAxisDetails", this.getProphylAxisDetails());
        sharedRecordMap.put("vaccinationDetails", this.getVaccinationDetails());
        sharedRecordMap.put("familyPlanningDetails", this.getFamilyPlanningDetails());
        sharedRecordMap.put("laborAndDeliveryDetails", this.getLaborAndDeliveryDetails());
        sharedRecordMap.put("postnatalDetails", this.getPostnatalDetails());
        sharedRecordMap.put("billingsDetails", this.getBillingsDetails());
        sharedRecordMap.put("visitMainPaymentDetails", this.getVisitMainPaymentDetails());
        sharedRecordMap.put("referralDetails", this.getReferralDetails());
        sharedRecordMap.put("otherInformation", this.getOtherInformation());
        sharedRecordMap.put("appointment", this.getAppointment().stream().map(AppointmentDetailsDTO::toMap));
        return  sharedRecordMap;
    }
}
