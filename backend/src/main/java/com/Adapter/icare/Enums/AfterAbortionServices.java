package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum AfterAbortionServices {
    MVA,
    MEDICALTREATMENT,
    SHARPCURRATAGE;

    public static final String INVALID_AFTER_ABORTION_SERVICE = "Invalid after abortion service:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(AfterAbortionServices.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static AfterAbortionServices fromString(String value) {
        if (value == null) {
            //throw new IllegalArgumentException(INVALID_AFTER_ABORTION_SERVICE +" Input after abortion service value cannot be null. " + ALLOWED_VALUES_MESSAGE);
            return null;
        }
        try {
            return AfterAbortionServices.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_AFTER_ABORTION_SERVICE + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
