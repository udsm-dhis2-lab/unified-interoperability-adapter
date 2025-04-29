package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum BirthPlace {
    LD,
    RHC,
    RHS,
    TBA,
    H,
    BBA,
    HF;

    public static final String INVALID_BIRTH_PLACE = "Invalid birth place:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(BirthPlace.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static BirthPlace fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException(INVALID_BIRTH_PLACE +" Input birth place value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return BirthPlace.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_BIRTH_PLACE + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
