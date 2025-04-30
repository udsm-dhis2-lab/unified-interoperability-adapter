package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum BirthPlace {
    LD,
    RHC,
    RHS,
    TBA,
    H,
    BBA,
    HF;

    public static final String INVALID_BIRTH_PLACE_PREFIX = "Invalid birth place:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(BirthPlace.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static BirthPlace fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_BIRTH_PLACE_PREFIX +" Input birth place value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_BIRTH_PLACE_PREFIX + " Input birth place value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return BirthPlace.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_BIRTH_PLACE_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_BIRTH_PLACE_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
