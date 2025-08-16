package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum PeriodType {
    DAY,
    WEEK,
    MONTH,
    YEAR,
    MINUTE,
    UNKNOWN;

    public static final String INVALID_PERIOD_TYPE_PREFIX = "Invalid period type:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(PeriodType.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static PeriodType fromString(String value) {
        try {
            if (value == null) {
                // throw new IllegalArgumentException(INVALID_PERIOD_TYPE_PREFIX+ " Input period type value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_PERIOD_TYPE_PREFIX + " Input period type value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return PeriodType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_PERIOD_TYPE_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_PERIOD_TYPE_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
