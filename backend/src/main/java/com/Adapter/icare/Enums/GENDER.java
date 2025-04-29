package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum GENDER {
    M,
    F;

    public static final String INVALID_GENDER = "Invalid gender:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(GENDER.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static GENDER fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException(INVALID_GENDER +" Input gender value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return GENDER.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_GENDER + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
