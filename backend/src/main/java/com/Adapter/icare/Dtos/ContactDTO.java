package com.Adapter.icare.Dtos;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.validation.constraints.NotNull;

public class ContactDTO {
    private String system;
    @NotNull
    private String value;
    private String use;

    public ContactDTO(String system, String value, String use) {
        this.system = system;
        this.value = value;
        this.use = use;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getUse() {
        return use;
    }

    public void setUse(String use) {
        this.use = use;
    }
}
