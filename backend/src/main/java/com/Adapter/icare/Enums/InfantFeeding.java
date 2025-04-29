package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum InfantFeeding {
    EBF,
    MF;

    public static final String INVALID_INFANT_FEEDING = "Invalid infant feeding:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(InfantFeeding.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static InfantFeeding fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException(INVALID_INFANT_FEEDING +" Input infant feeding value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return InfantFeeding.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_INFANT_FEEDING + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
