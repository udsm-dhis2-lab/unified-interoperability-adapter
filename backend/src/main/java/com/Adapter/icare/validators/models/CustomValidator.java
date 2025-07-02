package com.Adapter.icare.validators.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomValidator {
    private String ruleExpression;
    private String message;
    private String description;
    private String name;
    private String code;
}
