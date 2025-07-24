package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.SpecimenAcceptanceStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class LabRequestDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateOccurred;
    private String specimenID;
    private String typeOfSpecimen;
    private String specimenSiteCode;
    private String specimenCollectedFrom;
    private Integer specimenCollectionVolumeInMl;
    private SpecimenAcceptanceStatus specimenAcceptanceStatus;
    private List<String> specimenRejectionCodes;
    private String specimenCollectorName;
    private String specimenCollectorContactNumber;
    private Instant dateTimeSpecimenCollected;
    private Boolean specimenSentToLab;
    private Instant dateTimeSpecimenSentToLab;
    private Instant dateTimeSpecimenReceived;
    private String specimenRegisteredBy;
    private Instant dateTimeSpecimenRegistered;
    private RequestingFacilityDTO requestingFacility;
    private String requestTypeCode;
    private String referringRequestId;
    private String therapy;
    private List<LabTestsDTO> labTests;
    private List<LabTestResultsFinalDTO> labTestResults;


    public Map<String, Object> toMap(){
        Map<String, Object> labRequestMap = new HashMap<String, Object>();
        labRequestMap.put("dateOccurred", this.getDateOccurred());
        labRequestMap.put("specimenID", this.getSpecimenID());
        labRequestMap.put("typeOfSpecimen", this.getTypeOfSpecimen());
        labRequestMap.put("specimenSiteCode", this.getSpecimenSiteCode());
        labRequestMap.put("specimenCollectedFrom", this.getSpecimenCollectedFrom());
        labRequestMap.put("specimenCollectionVolumeInMl", this.getSpecimenCollectionVolumeInMl());
        labRequestMap.put("specimenAcceptanceStatus", this.getSpecimenAcceptanceStatus());
        labRequestMap.put("specimenRejectionCodes", this.getSpecimenRejectionCodes());
        labRequestMap.put("specimenCollectorName", this.getSpecimenCollectorName());
        labRequestMap.put("specimenCollectorContactNumber", this.getSpecimenCollectorContactNumber());
        labRequestMap.put("dateTimeSpecimenCollected", this.getDateTimeSpecimenCollected());
        labRequestMap.put("specimenSentToLab", this.getSpecimenSentToLab());
        labRequestMap.put("dateTimeSpecimenReceived", this.getDateTimeSpecimenReceived());
        labRequestMap.put("specimenRegisteredBy", this.getSpecimenRegisteredBy());
        labRequestMap.put("dateTimeSpecimenRegistered", this.getDateTimeSpecimenRegistered());
        labRequestMap.put("requestingFacility", this.requestingFacility.toMap());
        labRequestMap.put("requestTypeCode", this.getRequestTypeCode());
        labRequestMap.put("referringRequestId", this.getReferringRequestId());
        labRequestMap.put("therapy", this.getTherapy());
        labRequestMap.put("labTests", this.getLabTests());
        labRequestMap.put("labTestResults", this.getLabTestResults());
        return labRequestMap;
    }
}
