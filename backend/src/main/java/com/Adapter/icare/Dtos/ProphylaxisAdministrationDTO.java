package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.ServiceModality;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProphylaxisAdministrationDTO {
    private Boolean administered;
    private ServiceModality serviceModality;
}
