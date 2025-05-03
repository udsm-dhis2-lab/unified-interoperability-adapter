package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CHProphylaxisDTO {
    private ProphylaxisAdministrationDTO albendazole;
    private ProphylaxisAdministrationDTO vitaminA;
    private Boolean providedWithLLIN;
}
