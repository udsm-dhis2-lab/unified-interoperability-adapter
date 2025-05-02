package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.GENDER;
import com.Adapter.icare.Enums.InfantFeeding;
import com.Adapter.icare.Enums.MethodOfResuscitation;
import com.Adapter.icare.Enums.STATUS;
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
    private Boolean multipleBirth;
    private Boolean exclusiveBreastFed;
    private Boolean marcerated;
    private Boolean fresh;
    private Integer motherAgeInYears;
    private Integer birthOrder;
    private InfantFeeding infantFeeding;
    private GENDER gender;
    private Boolean providedWithKmc;
    private Integer bp;
    private Boolean hbigTested;
    private STATUS childHivStatus;
    private InfectionsDTO infections;
    private BDOutcomeDetailsDTO outcomeDetails;
    private CodeAndNameDTO motherHivStatus;
    private Boolean providedWithARV;
    private Boolean referred;
    private List<VaccinationDetailsDTO> vaccinationDetails;
    private List<Map<String,Object>> otherServices;
    private Boolean bornWithDisabilities;
    private ApgaScoreDTO apgaScore;
    private Boolean wasBreastFedWithinOneHourAfterDelivery;
    private MethodOfResuscitation methodOfResuscitation;
    private Boolean hivDnaPCRTested;

}
