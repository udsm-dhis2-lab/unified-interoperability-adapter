package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum Priority {
    A,
    P,
    R,
    S,
    T,
    C,
    E,
    U;

    public static final String INVALID_PRIORITY_PREFIX = "Invalid priority:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(Priority.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static Priority fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_PRIORITY_PREFIX +" Input priority value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_PRIORITY_PREFIX + " Input  priority  value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }

            switch (value) {
                case "routine":
                    return Priority.R;
                case "urgent":
                    return Priority.U;
                case "asap":
                    return Priority.A;
                case "stat":
                    return Priority.S;
            }

            return Priority.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_PRIORITY_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_PRIORITY_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
