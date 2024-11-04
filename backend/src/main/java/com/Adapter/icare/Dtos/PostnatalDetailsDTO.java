package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class PostnatalDetailsDTO {
    private boolean positiveHivStatusBeforeService;
    private ProvidedAndCodeDTO demagedNipples;
    private ProvidedAndCodeDTO mastitis;
    private ProvidedAndCodeDTO breastAbscess;
    private ProvidedAndCodeDTO fistula;
    private ProvidedAndCodeDTO puerperalPsychosis;
    private Map<String,Object> otherServices;
}
