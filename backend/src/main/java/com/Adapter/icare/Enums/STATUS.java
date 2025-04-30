package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum STATUS {
    NEGATIVE,
    POSITIVE;

    public static final String INVALID_STATUS_PREFIX = "Invalid status:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(STATUS.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static STATUS fromString(String value) {
        try {
            if (value == null) {
                // throw new IllegalArgumentException(INVALID_STATUS_PREFIX+ " Input status value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_STATUS_PREFIX + " Input status value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return STATUS.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_STATUS_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_STATUS_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
