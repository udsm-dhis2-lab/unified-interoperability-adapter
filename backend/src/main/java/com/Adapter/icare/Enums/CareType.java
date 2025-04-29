package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum CareType {
    OPD,
    IPD,
    ANC,
    DENTAL,
    EYE;

    public static final String INVALID_CARE_TYPE_PREFIX = "Invalid careType:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(CareType.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static CareType fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException(INVALID_CARE_TYPE_PREFIX + " Input CareType value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return CareType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_CARE_TYPE_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
