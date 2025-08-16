package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;


@Slf4j
public enum PlaceOfDeath {
    ACCIDENT,
    COMMUNITY,
    EN_ROUTE_TO_HEALTH_FACILITY,
    HEALTH_FACILITY,
    HOUSEHOLD;

    public static final String INVALID_PLACE_OF_DEATH_PREFIX = "Invalid place of death:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(PlaceOfDeath.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static PlaceOfDeath fromString(String value) {
        try {
            if (value == null) {
                // throw new IllegalArgumentException(INVALID_PLACE_OF_DEATH_PREFIX+ " Input place of death value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_PLACE_OF_DEATH_PREFIX + " Input place of death value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return PlaceOfDeath.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_PLACE_OF_DEATH_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_PLACE_OF_DEATH_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}

