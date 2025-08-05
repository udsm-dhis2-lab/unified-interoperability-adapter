package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum CareType {
    OPD,
    IPD,
    ANC,
    DENTAL,
    FP,
    EYE;

    public static final String INVALID_CARE_TYPE_PREFIX = "Invalid careType:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(CareType.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static CareType fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_CARE_TYPE_PREFIX + " Input CareType value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_CARE_TYPE_PREFIX + " Input CareType value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return CareType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_CARE_TYPE_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_CARE_TYPE_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
