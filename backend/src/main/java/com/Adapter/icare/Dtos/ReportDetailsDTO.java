package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class ReportDetailsDTO {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private String reportingDate;
    private Instant reportingDateTime;

    public Map<String, Object> toMap(){
        Map<String, Object> reportDetailsMap = new HashMap<>();
        reportDetailsMap.put("reportingDate", this.getReportingDate());
        reportDetailsMap.put("reportingDateTime", this.getReportingDateTime().toString());
        return reportDetailsMap;
    }
}
