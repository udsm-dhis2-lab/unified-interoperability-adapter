package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum ReferReason {
    CPAC,
    OTHERS;

    public static final String INVALID_REFER_REASON = "Invalid refer reason:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(ReferReason.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static ReferReason fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException(INVALID_REFER_REASON +" Input refer reason value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return ReferReason.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_REFER_REASON + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
