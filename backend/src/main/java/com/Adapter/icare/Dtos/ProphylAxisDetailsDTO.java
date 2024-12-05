package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Getter
@Setter
public class ProphylAxisDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;
    private String code;
    private String type;
    private String name;
    private String status;
    private String notes;
    private ReactionDTO reaction;
}
