package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.LabTrackingStatus;
import com.Adapter.icare.Enums.SpecimenAcceptanceStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
public class LabTestResultsFinalDTO {
    private SpecimenAcceptanceStatus specimenAcceptanceStatus;
    private List<CodeDTO> specimenRejectionCodes;
    private CodeDTO typeOfTest;
    private Instant testOrderDate;
    private Integer obrSetId;
    private CodeDTO analyzerCode;
    private Instant dateTimeSpecimenAnalyzed;
    private CodeDTO resultStatus;
    private Instant testResultDate;
    private String testingFacilityCode;
    private String referringSpecimenId;
    private Instant dateTimeResultsRegistered;
    private String resultsAuthorisedBy;
    private Instant dateTimeResultsAuthorized;
    private String specimenTestedBy;
    private Integer targetTimeDays;
    private Integer targetTimeMins;
    private List<LabObservationDTO> results;

    public Map<String, Object> toMap(){
        Map<String, Object> testResultsMap = new HashMap<>();
        testResultsMap.put("testOrderDate", this.getTestOrderDate().toString());
        testResultsMap.put("analyzerCode", this.getAnalyzerCode());
        testResultsMap.put("dateTimeSpecimenAnalyzed", this.getDateTimeSpecimenAnalyzed().toString());
        testResultsMap.put("testResultDate", this.getTestResultDate().toString());
        testResultsMap.put("testingFacilityCode", this.getTestingFacilityCode());
        testResultsMap.put("dateTimeResultsRegistered", this.getDateTimeResultsRegistered().toString());
        testResultsMap.put("resultsAuthorisedBy", this.getResultsAuthorisedBy());
        testResultsMap.put("dateTimeResultsAuthorized", this.getDateTimeResultsAuthorized().toString());
        testResultsMap.put("targetTimeDays", this.getTargetTimeDays());
        testResultsMap.put("targetTimeMins", this.getTargetTimeMins());
        testResultsMap.put("results", this.getResults().isEmpty() ? this.getResults() : this.getResults().stream().map(LabObservationDTO::toMap).collect(Collectors.toList()));
        return testResultsMap;
    }

}
