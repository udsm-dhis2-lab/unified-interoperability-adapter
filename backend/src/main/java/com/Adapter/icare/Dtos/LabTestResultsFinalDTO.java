package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.LabTrackingStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class LabTestResultsFinalDTO {
    private LabTrackingStatus resultStatusCode;
    private String testCode;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date testOrderDate;
    private String testOrderId;
    private String testType;
    private String analyzerCode;
    private Instant dateTimeSpecimenAnalyzed;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date testResultDate;
    private String testingFacilityCode;
    private String referringRequestId;
    private Instant dateTimeResultsRegistered;
    private String resultsAuthorisedBy;
    private Instant dateTimeResultsAuthorized;
    private Integer targetTimeDays;
    private Integer targetTimeMins;
    private Boolean standardCode;
    private String testStatus;
    private List<LabObservationDTO> results;
    private List<PostLabTestResultsDTO> postLabTestResults;

    public Map<String, Object> toMap(){
        Map<String, Object> testResultsMap = new HashMap<>();
        testResultsMap.put("resultStatusCode", this.getResultStatusCode());
        testResultsMap.put("testCode", this.getTestCode());
        testResultsMap.put("testOrderDate", this.getTestOrderDate());
        testResultsMap.put("testOrderId", this.getTestOrderId());
        testResultsMap.put("testType", this.getTestType());
        testResultsMap.put("analyzerCode", this.getAnalyzerCode());
        testResultsMap.put("dateTimeSpecimenAnalyzed", this.getDateTimeSpecimenAnalyzed());
        testResultsMap.put("testResultDate", this.getTestResultDate());
        testResultsMap.put("testingFacilityCode", this.getTestingFacilityCode());
        testResultsMap.put("referringRequestId", this.getReferringRequestId());
        testResultsMap.put("dateTimeResultsRegistered", this.getDateTimeResultsRegistered());
        testResultsMap.put("resultsAuthorisedBy", this.getResultsAuthorisedBy());
        testResultsMap.put("dateTimeResultsAuthorized", this.getDateTimeResultsAuthorized());
        testResultsMap.put("targetTimeDays", this.getTargetTimeDays());
        testResultsMap.put("targetTimeMins", this.getTargetTimeMins());
        testResultsMap.put("standardCode", this.getStandardCode());
        testResultsMap.put("testStatus", this.getTestStatus());
        testResultsMap.put("results", this.getResults());
        testResultsMap.put("postLabTestResults", this.getPostLabTestResults());
        return testResultsMap;
    }

}
