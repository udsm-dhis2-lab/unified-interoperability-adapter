package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum InfantFeeding {
    EBF,
    RF,
    MF;

    public static final String INVALID_INFANT_FEEDING_PREFIX = "Invalid infant feeding:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(InfantFeeding.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static InfantFeeding fromString(String value) {
        try {
            if (value == null) {
//            throw new IllegalArgumentException(INVALID_INFANT_FEEDING_PREFIX +" Input infant feeding value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_INFANT_FEEDING_PREFIX + " Input infant feeding value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return InfantFeeding.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_INFANT_FEEDING_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_INFANT_FEEDING_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
