package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class LongTermMethodDTO {
    private boolean provided;
    private String type;
    @NotNull
    private String code;
}
