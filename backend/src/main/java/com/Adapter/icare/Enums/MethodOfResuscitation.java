package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum MethodOfResuscitation {
    SUCTION,
    STIMULATION,
    BAGANDMASK;

    public static final String INVALID_METHOD_OF_RESUSCITATION = "Invalid method of resuscitation:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(MethodOfResuscitation.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static MethodOfResuscitation fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException(INVALID_METHOD_OF_RESUSCITATION +" Input method of resuscitation value cannot be null. " + ALLOWED_VALUES_MESSAGE);
        }
        try {
            return MethodOfResuscitation.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(INVALID_METHOD_OF_RESUSCITATION + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
        }
    }
}
