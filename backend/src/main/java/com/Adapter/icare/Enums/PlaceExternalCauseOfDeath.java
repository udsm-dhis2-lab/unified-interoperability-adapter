package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum PlaceExternalCauseOfDeath {
    HOME,
    ORGANIZATION_RESIDENCE,
    OTHERS,
    COMMUNITY,
    WORK_AREA,
    INDUSTRIAL_AREAS,
    SPORTS_PLAYGROUND,
    SCHOOL,
    FARM;

    public static final String INVALID_PLACE_EXTERNAL_CAUSE_DEATH_PREFIX = "Invalid place external cause death:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(PlaceExternalCauseOfDeath.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static PlaceExternalCauseOfDeath fromString(String value) {
        try {
            if (value == null) {
                // throw new IllegalArgumentException(INVALID_PLACE_EXTERNAL_CAUSE_DEATH_PREFIX+ " Input place external cause death value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_PLACE_EXTERNAL_CAUSE_DEATH_PREFIX + " Input place external cause death value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return PlaceExternalCauseOfDeath.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_PLACE_EXTERNAL_CAUSE_DEATH_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_PLACE_EXTERNAL_CAUSE_DEATH_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}

