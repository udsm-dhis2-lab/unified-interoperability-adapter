package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ProphylAxisDetailsDTO {
    private Date date;
    private String type;
    private String status;
    private String notes;
    private ReactionDTO reaction;
}
