package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.BirthPlace;
import com.Adapter.icare.Enums.PlaceOfOrigin;
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
public class PostnatalDetailsDTO {
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date;
    private Boolean positiveHivStatusBeforeService;
    private STATUS hivStatusAsSeenFromAncCard;
    private LDHivDetailsDTO hivDetails;
    private PlaceOfOrigin motherAndChildOrigin;
    private Boolean referredToCTC;
    private BirthPlace placeOfBirth;
    private PNCProphylaxisDTO prophylaxis;
    private List<CounsellingDTO> counselling;
    private Boolean referredToClinicForFurtherServices;
    private Integer daysSinceDelivery;
    private String outCome;
    private Integer APGARScore;
    private Map<String,Object> breastFeedingDetails;
    private List<BirthDetailsDTO> birthDetails;
    private ProvidedAndCodeDTO demagedNipples;
    private ProvidedAndCodeDTO mastitis;
    private ProvidedAndCodeDTO breastAbscess;
    private ProvidedAndCodeDTO fistula;
    private ProvidedAndCodeDTO puerperalPsychosis;
    private List<Map<String,Object>> otherServices;
}
