package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;
import java.util.Map;

@Getter
@Setter
public class LifeStyleInformationDTO {
    private Map<String,Object> smoking;
    private Map<String,Object> alcoholUse;
    private Map<String,Object> drugUse;
}
