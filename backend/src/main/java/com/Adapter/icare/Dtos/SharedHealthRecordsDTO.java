package com.Adapter.icare.Dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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


    @Schema(description = "This field is deprecated. It wont work starting v1.0.9", deprecated = true)
    private List<InvestigationDetailsDTO> investigationDetails;

    @Schema(description = "This field is deprecated. It wont work starting v1.0.9", deprecated = true)
    private List<LabInvestigationDetailsDTO> labInvestigationDetails;


    private List<LabRequestDetailsDTO> labRequestDetails;

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

    private List<ProphylaxisDetailsDTO> prophylAxisDetails;

    private List<VaccinationDetailsDTO> vaccinationDetails;

    private FamilyPlanningDetailsDTO familyPlanningDetails;

    private ChildHealthDetailsDTO childHealthDetails;

    private CpacDetailsDTO cpacDetails;

    private CecapDTO cecap;

    private ContraceptivesDTO contraceptives;

    private List<BillingsDetailsDTO> billingsDetails;

    private VisitMainPaymentDetailsDTO visitMainPaymentDetails;

    private ReferralDetailsDTO referralDetails;

    private OtherInformationDTO otherInformation;

    private DeathRegistryDTO deathRegistry;

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
        sharedRecordMap.put("labRequestDetails", this.getLabRequestDetails() == null || this.getLabRequestDetails().isEmpty() ? this.getLabRequestDetails() : this.getLabRequestDetails().stream().map(LabRequestDetailsDTO::toMap).collect(Collectors.toList()));
        sharedRecordMap.put("labInvestigationDetails", this.getLabInvestigationDetails());
        sharedRecordMap.put("diagnosisDetails", this.getDiagnosisDetails());
        sharedRecordMap.put("medicationDetails", this.getMedicationDetails());
        sharedRecordMap.put("eyeClinicDetails", this.getEyeClinicDetails());
        sharedRecordMap.put("treatmentDetails", this.getTreatmentDetails());
        sharedRecordMap.put("childHealthDetails", this.getChildHealthDetails());
        sharedRecordMap.put("radiologyDetails", this.getRadiologyDetails());
        sharedRecordMap.put("admissionDetails", this.getAdmissionDetails());
        sharedRecordMap.put("outcomeDetails", this.getOutcomeDetails());
        sharedRecordMap.put("causesOfDeathDetails", this.getCausesOfDeathDetails());
        sharedRecordMap.put("antenatalCareDetails", this.getAntenatalCareDetails());
        sharedRecordMap.put("prophylAxisDetails", this.getProphylAxisDetails() == null || this.getProphylAxisDetails().isEmpty() ? this.getProphylAxisDetails() : this.getProphylAxisDetails().stream().map(ProphylaxisDetailsDTO::toMap).collect(Collectors.toList()));
        sharedRecordMap.put("vaccinationDetails", this.getVaccinationDetails());
        sharedRecordMap.put("familyPlanningDetails", this.getFamilyPlanningDetails());
        sharedRecordMap.put("laborAndDeliveryDetails", this.getLaborAndDeliveryDetails());
        sharedRecordMap.put("cpacDetails", this.getCpacDetails());
        sharedRecordMap.put("cecapDetails", this.getCecap());
        sharedRecordMap.put("postnatalDetails", this.getPostnatalDetails());
        sharedRecordMap.put("contraceptives", this.getContraceptives());
        sharedRecordMap.put("billingsDetails", this.getBillingsDetails() == null || this.getBillingsDetails().isEmpty() ? this.getBillingsDetails() : this.getBillingsDetails().stream().map(BillingsDetailsDTO::toMap).collect(Collectors.toList()));
        sharedRecordMap.put("visitMainPaymentDetails", this.getVisitMainPaymentDetails());
        sharedRecordMap.put("selfMonitoringClinicalInformation", this.getSelfMonitoringClinicalInformation());
        sharedRecordMap.put("deathRegistry", this.getDeathRegistry());
        sharedRecordMap.put("referralDetails", this.getReferralDetails());
        sharedRecordMap.put("otherInformation", this.getOtherInformation());
        sharedRecordMap.put("appointment", this.getAppointment() == null || this.getAppointment().isEmpty() ? this.getAppointment() : this.getAppointment().stream().map(AppointmentDetailsDTO::toMap).collect(Collectors.toList()));
        return sharedRecordMap;
    }
}
