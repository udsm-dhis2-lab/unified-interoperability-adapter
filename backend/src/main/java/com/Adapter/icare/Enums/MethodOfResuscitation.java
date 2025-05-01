package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum MethodOfResuscitation {
    SUCTION,
    STIMULATION,
    BAGANDMASK;

    public static final String INVALID_METHOD_OF_RESUSCITATION_PREFIX = "Invalid method of resuscitation:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(MethodOfResuscitation.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static MethodOfResuscitation fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_METHOD_OF_RESUSCITATION +" Input method of resuscitation value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_METHOD_OF_RESUSCITATION_PREFIX + " Input method of resuscitation value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return MethodOfResuscitation.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_METHOD_OF_RESUSCITATION + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_METHOD_OF_RESUSCITATION_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
