package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.STATUS;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FPHivStatusDTO {
    private STATUS status;
    private Boolean referredToCTC;
}
