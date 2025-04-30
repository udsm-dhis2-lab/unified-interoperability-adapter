package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum ServiceLocations {
    FOR,
    CBD,
    RCH,
    CTC,
    COR;

    public static final String INVALID_SERVICE_LOCATION_PREFIX = "Invalid service location:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(ServiceLocations.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static ServiceLocations fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_SERVICE_LOCATION_PREFIX +" Input service location value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_SERVICE_LOCATION_PREFIX + " Input  service location value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return ServiceLocations.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_SERVICE_LOCATION_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_SERVICE_LOCATION_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
