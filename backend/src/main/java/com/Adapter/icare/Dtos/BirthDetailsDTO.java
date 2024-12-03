package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class BirthDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    private Float weightInKgs;
    private boolean multipleBirth;
    private boolean exclusiveBreastFed;
    private boolean marcerated;
    private boolean fresh;
    private Integer motherAgeInYears;
    private Integer birthOrder;
    private CodeAndNameDTO motherHivStatus;
    private boolean providedWithARV;
    private boolean referred;
    private List<VaccinationDetailsDTO> vaccinationDetails;
    private BreatheAssistanceDTO breatheAssistance;
    private List<Map<String,Object>> otherServices;
}
