package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class FamilyPlanningDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;
    private List<LongTermMethodDTO> longTermMethods;
    private List<ShortTermMethodDTO> shortTermMethods;
}
