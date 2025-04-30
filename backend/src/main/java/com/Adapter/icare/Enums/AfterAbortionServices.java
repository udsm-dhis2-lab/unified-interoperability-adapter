package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum AfterAbortionServices {
    MVA,
    MEDICALTREATMENT,
    SHARPCURRATAGE;

    public static final String INVALID_AFTER_ABORTION_SERVICE_PREFIX = "Invalid after abortion service:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(AfterAbortionServices.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static AfterAbortionServices fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_AFTER_ABORTION_SERVICE_PREFIX +" Input after abortion service value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_AFTER_ABORTION_SERVICE_PREFIX + " Input after abortion service value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return AfterAbortionServices.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_AFTER_ABORTION_SERVICE_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_AFTER_ABORTION_SERVICE_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
