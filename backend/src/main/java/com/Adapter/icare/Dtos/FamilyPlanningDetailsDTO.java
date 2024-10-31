package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FamilyPlanningDetailsDTO {
    private List<LongTermMethodDTO> longTermMethods;
    private List<ShortTermMethodDTO> shortTermMethods;
}
