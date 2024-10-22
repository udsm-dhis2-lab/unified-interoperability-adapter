package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class OutcomeDetailsDTO {
    private boolean isAlive;
    private String deathLocation;
    private Date deathDate;
    private String contactTracing;
    private boolean investigationConducted;
    private boolean referred;
}
