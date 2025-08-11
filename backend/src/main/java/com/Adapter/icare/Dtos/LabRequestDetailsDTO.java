package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.RequestTypeCode;
import com.Adapter.icare.Enums.SpecimentCollectedFrom;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
public class LabRequestDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String dateOccurred;
    private String specimenID;
    private CodeDTO typeOfSpecimen;
    private CodeDTO specimenSite;
    private SpecimentCollectedFrom specimenCollectedFrom;
    private Integer specimenCollectionVolumeInMl;
    private String specimenCollectorName;
    private String specimenCollectorContactNumber;
    private Instant dateTimeSpecimenCollected;
    private Boolean specimenSentToLab;
    private Instant dateTimeSpecimenSentToLab;
    private Instant dateTimeSpecimenReceived;
    private String specimenRegisteredBy;
    private Instant dateTimeSpecimenRegistered;
    private RequestingFacilityDTO requestingFacility;
    private RequestTypeCode requestTypeCode;
    private String referringSpecimenId;
    private List<String> clinicalCodes;
    private String clinicalNotes;
    private ReceivingFacilityDTO receivingFacility;
    private List<LabTestsDTO> requestedLabTests;
    private List<LabTestResultsFinalDTO> labTestResults;
    private List<PostLabTestResultsDTO> postLabTestResults;


    public Map<String, Object> toMap(){
        Map<String, Object> labRequestMap = new HashMap<String, Object>();
        labRequestMap.put("dateOccurred", this.getDateOccurred());
        labRequestMap.put("specimenID", this.getSpecimenID());
        labRequestMap.put("typeOfSpecimen", this.getTypeOfSpecimen() != null ? this.getTypeOfSpecimen().toMap() : null);
        labRequestMap.put("specimenSite", this.getSpecimenSite() != null ? this.getSpecimenSite().toMap() : null);
        labRequestMap.put("specimenCollectedFrom", this.getSpecimenCollectedFrom());
        labRequestMap.put("specimenCollectionVolumeInMl", this.getSpecimenCollectionVolumeInMl());
        labRequestMap.put("specimenCollectorName", this.getSpecimenCollectorName());
        labRequestMap.put("specimenCollectorContactNumber", this.getSpecimenCollectorContactNumber());
        labRequestMap.put("dateTimeSpecimenCollected", this.getDateTimeSpecimenCollected() != null ? this.getDateTimeSpecimenCollected().toString() : null);
        labRequestMap.put("specimenSentToLab", this.getSpecimenSentToLab());
        labRequestMap.put("dateTimeSpecimenSentToLab", this.getDateTimeSpecimenSentToLab() != null ? this.getDateTimeSpecimenSentToLab().toString() : null);
        labRequestMap.put("dateTimeSpecimenReceived", this.getDateTimeSpecimenReceived() != null ? this.getDateTimeSpecimenReceived().toString() : null);
        labRequestMap.put("specimenRegisteredBy", this.getSpecimenRegisteredBy());
        labRequestMap.put("dateTimeSpecimenRegistered", this.getDateTimeSpecimenRegistered() != null ? this.getDateTimeSpecimenRegistered().toString() : null);
        labRequestMap.put("requestingFacility", this.getRequestingFacility() != null ? this.getRequestingFacility().toMap() : null);
        labRequestMap.put("requestTypeCode", this.getRequestTypeCode());
        labRequestMap.put("referringSpecimenId", this.getReferringSpecimenId());
        labRequestMap.put("clinicalCodes", this.getClinicalCodes());
        labRequestMap.put("requestedLabTests", this.getRequestedLabTests() == null || this.getRequestedLabTests().isEmpty() ? this.getRequestedLabTests() : this.getRequestedLabTests().stream().map(LabTestsDTO::toMap).collect(Collectors.toList()));
        labRequestMap.put("labTestResults", this.getLabTestResults() != null && !this.getLabTestResults().isEmpty() ? this.getLabTestResults().stream().map(LabTestResultsFinalDTO::toMap).collect(Collectors.toList()) : this.getLabTestResults());
        labRequestMap.put("postLabTestResults", this.getPostLabTestResults() == null || this.getPostLabTestResults().isEmpty() ? this.getPostLabTestResults() : this.getPostLabTestResults().stream().map(PostLabTestResultsDTO::toMap).collect(Collectors.toList()));
        return labRequestMap;
    }
}
