package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class RadiologyDetailsDTO {
    private Date testDate;
    private String testTypeName;
    private String testTypeCode;
    private String testReport;
    private String bodySite;
    private String url;
}
