package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum GENDER {
    M,
    F;

    public static final String INVALID_GENDER_PREFIX = "Invalid gender:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(GENDER.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static GENDER fromString(String value) {
        try {
            if (value == null) {
//            throw new IllegalArgumentException(INVALID_GENDER_PREFIX +" Input gender value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_GENDER_PREFIX + " Input gender value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return GENDER.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_GENDER_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_GENDER_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
