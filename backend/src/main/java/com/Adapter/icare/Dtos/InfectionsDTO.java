package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InfectionsDTO {
    private Boolean hasSepticaemia;
    private Boolean hasOmphalitis;
    private Boolean hasSkinInfection;
    private Boolean hasOcularInfection;
    private Boolean hasJaundice;
}
