package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum ServiceLocations {
    FOR,
    CBD,
    RCH,
    CTC,
    COR;

    public static final String INVALID_SERVICE_LOCATION = "Invalid service location:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(ServiceLocations.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static ServiceLocations fromString(String value) {
        if (value == null) {
            //throw new IllegalArgumentException(INVALID_SERVICE_LOCATION +" Input service location value cannot be null. " + ALLOWED_VALUES_MESSAGE);
            return null;
        }
        try {
            return ServiceLocations.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_SERVICE_LOCATION + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
