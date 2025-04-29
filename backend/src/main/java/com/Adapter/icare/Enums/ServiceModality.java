package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum ServiceModality {
    CAMPAIGN,
    ROUTINE;

    public static final String INVALID_SERVICE_MODALITY = "Invalid service modality:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(ServiceModality.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static ServiceModality fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException(INVALID_SERVICE_MODALITY +" Input service modality value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return ServiceModality.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_SERVICE_MODALITY + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
