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
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date testResultDate;
    private String testStatus;
    private String testType;
    @NotNull
    private Boolean standardCode;
    private String codeType;
    private List<LabTestResultsDTO> testResults;
}
