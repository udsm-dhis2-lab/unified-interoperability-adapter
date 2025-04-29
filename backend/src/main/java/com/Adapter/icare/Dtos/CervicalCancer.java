package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CervicalCancer {
    private boolean suspected;
    private boolean screenedWithVIA;
    private  boolean viaTestPositive;
}
