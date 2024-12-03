package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Getter
@Setter
public class OutcomeDetailsDTO {
    private Boolean isAlive;
    private String deathLocation;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date deathDate;
    private Boolean contactTracing;
    private Boolean investigationConducted;
    private Boolean quarantined;
    private Boolean referred;
}
