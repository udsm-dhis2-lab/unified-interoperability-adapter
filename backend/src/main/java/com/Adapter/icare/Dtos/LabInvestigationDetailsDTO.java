package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class LabInvestigationDetailsDTO {
    private String testCode;
    private Date testOrderDate;
    private String testSampleId;
    private String testOrderId;
    private Date testResultDate;
    private String testStatus;
    private String testType;
    private boolean standardCode;
    private String codeType;
    private List<LabTestResultsDTO> testResults;
}
