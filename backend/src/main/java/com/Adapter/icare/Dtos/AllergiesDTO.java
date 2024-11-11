package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class AllergiesDTO {
    private String code;
    private String category;
    private String name;
    private String criticality;
    private String verificationStatus;
}
