package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class VisitDetailsDTO {
    private String id;
    private Date visitDate;
    private boolean newThisYear;
    private boolean isNew;
    private Date closedDate;
    private String visitType;
    private CareServiceDTO careService;
}
