package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum SpecimentCollectedFrom {
    RECOVERED,
    DECEASED,
    PATIENT;

    public static final String INVALID_SPECIMEN_COLLECTED_FROM_PREFIX = "Invalid specimen collected from:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(SpecimentCollectedFrom.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static SpecimentCollectedFrom fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_SPECIMEN_COLLECTED_FROM_PREFIX +" Input specimen collected from value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_SPECIMEN_COLLECTED_FROM_PREFIX + " Input  specimen acceptance status  value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return SpecimentCollectedFrom.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_SPECIMEN_COLLECTED_FROM_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_SPECIMEN_COLLECTED_FROM_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
