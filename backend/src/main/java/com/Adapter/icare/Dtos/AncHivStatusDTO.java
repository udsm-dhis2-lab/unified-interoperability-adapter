package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.STATUS;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AncHivStatusDTO {
    private STATUS status;
    private Integer numberOfTestTaken;
}
