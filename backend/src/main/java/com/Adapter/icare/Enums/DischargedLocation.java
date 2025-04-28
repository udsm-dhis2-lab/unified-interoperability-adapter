package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum DischargedLocation {
    H,
    RD,
    RCH,
    RHS,
    PNC;

    public static final String INVALID_DISCHARGED_LOCATION_PREFIX = "Invalid discharged location:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(DischargedLocation.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static DischargedLocation fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Input DischargedLocation value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return DischargedLocation.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_DISCHARGED_LOCATION_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
