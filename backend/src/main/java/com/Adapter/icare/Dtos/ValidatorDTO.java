package com.Adapter.icare.Dtos;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidatorDTO {
    private String ruleExpression;
    private String errorMessage;
    private String description;
    private String name;
    private String code;
}
