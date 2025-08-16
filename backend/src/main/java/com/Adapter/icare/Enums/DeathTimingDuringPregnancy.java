package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum DeathTimingDuringPregnancy {
    DURING_DELIVERY,
    WITHIN_FORTY_TWO_DAYS_DAYS,
    FORTY_TWO_DAYS_TO_ONE_YEAR,
    UNKNOWN;

    public static final String INVALID_DEATH_TIMING_DURING_PREGNANCY_PREFIX = "Invalid death timing during pregnancy:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(DeathTimingDuringPregnancy.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static DeathTimingDuringPregnancy fromString(String value) {
        try {
            if (value == null) {
                // throw new IllegalArgumentException(INVALID_DEATH_TIMING_DURING_PREGNANCY_PREFIX+ " Input place of death value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_DEATH_TIMING_DURING_PREGNANCY_PREFIX + " Input death timing during pregnancy value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return DeathTimingDuringPregnancy.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_DEATH_TIMING_DURING_PREGNANCY_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_DEATH_TIMING_DURING_PREGNANCY_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
