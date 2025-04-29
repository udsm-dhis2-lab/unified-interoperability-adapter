package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum CauseOfAbortion {
    SPONTANEOUS,
    SAVELIFE,
    DRUGUSESIDEEFFECTS,
    OTHERS;

    public static final String INVALID_CAUSE_OF_ABORTION = "Invalid cause of abortion:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(CauseOfAbortion.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static CauseOfAbortion fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException(INVALID_CAUSE_OF_ABORTION +" Input cause of abortion value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return CauseOfAbortion.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_CAUSE_OF_ABORTION + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
