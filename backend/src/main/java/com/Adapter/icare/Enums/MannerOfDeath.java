package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum MannerOfDeath {
    DISEASE,
    ACCIDENT,
    WAR,
    SUICIDE,
    UNKNOWN,
    DEATH_SENTENCE,
    ATTACKED,
    INVESTIGATION_IN_PROGRESS,
    TO_HANG_ONESELF_WITHOUT_KNOWN_CAUSES,
    UNRECOGNIZED_MANNER_OF_DEATH;

    public static final String INVALID_MANNER_OF_DEATH_PREFIX = "Invalid manner of death:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(MannerOfDeath.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static MannerOfDeath fromString(String value) {
        try {
            if (value == null) {
                // throw new IllegalArgumentException(INVALID_MANNER_OF_DEATH_PREFIX+ " Input MANNER of death value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_MANNER_OF_DEATH_PREFIX + " Input manner of death value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return MannerOfDeath.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_MANNER_OF_DEATH_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_MANNER_OF_DEATH_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}

