package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum YesNoUnknown {
    YES,
    NO,
    UNKNOWN;

    public static final String INVALID_YES_NO_UNKNOWN_PREFIX = "Invalid value:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(YesNoUnknown.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static YesNoUnknown fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_YES_NO_UNKNOWN_PREFIX +" Input value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_YES_NO_UNKNOWN_PREFIX + " Input value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return YesNoUnknown.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_YES_NO_UNKNOWN_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_YES_NO_UNKNOWN_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}

