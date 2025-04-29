package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.STATUS;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class HiVDetailsDTO {
    private STATUS status;
    private int hivTestNumber;
    private boolean referredToCTC;
    private AncHivStatusDTO ancHivStatus;
}
