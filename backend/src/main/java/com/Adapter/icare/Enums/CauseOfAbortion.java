package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum CauseOfAbortion {
    SPONTANEOUS,
    SAVELIFE,
    DRUGUSESIDEEFFECTS,
    OTHERS;

    public static final String INVALID_CAUSE_OF_ABORTION_PREFIX = "Invalid cause of abortion:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(CauseOfAbortion.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static CauseOfAbortion fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_CAUSE_OF_ABORTION_PREFIX +" Input cause of abortion value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_CAUSE_OF_ABORTION_PREFIX + " Input cause of abortion value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return CauseOfAbortion.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_CAUSE_OF_ABORTION_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_CAUSE_OF_ABORTION_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
