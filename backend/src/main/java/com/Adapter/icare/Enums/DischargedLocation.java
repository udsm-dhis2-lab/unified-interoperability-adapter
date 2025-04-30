package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
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
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_DISCHARGED_LOCATION_PREFIX + " Input DischargedLocation value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_DISCHARGED_LOCATION_PREFIX + " Input DischargedLocation value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return DischargedLocation.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_DISCHARGED_LOCATION_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_DISCHARGED_LOCATION_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
