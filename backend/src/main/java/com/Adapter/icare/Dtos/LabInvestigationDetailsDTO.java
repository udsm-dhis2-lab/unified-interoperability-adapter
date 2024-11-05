package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class LabInvestigationDetailsDTO {
    @NotNull
    private String testCode;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
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
