package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum ServiceModality {
    CAMPAIGN,
    ROUTINE;

    public static final String INVALID_SERVICE_MODALITY_PREFIX = "Invalid service modality:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(ServiceModality.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static ServiceModality fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_SERVICE_MODALITY_PREFIX +" Input service modality value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_SERVICE_MODALITY_PREFIX + " Input  service modality  value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return ServiceModality.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_SERVICE_MODALITY_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_SERVICE_MODALITY_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
