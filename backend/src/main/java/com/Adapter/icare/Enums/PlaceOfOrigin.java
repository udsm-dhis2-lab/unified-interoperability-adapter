package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum PlaceOfOrigin {
    LD,
    RHC,
    RHS,
    TBA,
    H,
    RD,
    D,
    HC,
    HS;

    public static final String INVALID_PLACE_OF_ORIGIN_PREFIX = "Invalid place of origin:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(PlaceOfOrigin.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static PlaceOfOrigin fromString(String value) {
        try {
            if (value == null) {
            // throw new IllegalArgumentException(INVALID_PLACE_OF_ORIGIN +" Input place of origin value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_PLACE_OF_ORIGIN_PREFIX + " Input place of origin value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return PlaceOfOrigin.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_PLACE_OF_ORIGIN + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_PLACE_OF_ORIGIN_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
