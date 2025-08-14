package com.Adapter.icare.Enums;

import com.Adapter.icare.CustomExceptions.InvalidEnumValueException;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum VisitType {
    IPD("IPD"),
    OPD("OPD");

    public static final String INVALID_VISIT_TYPE_PREFIX = "Invalid visit type:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(VisitType.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    private final String value;

    VisitType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static VisitType fromString(String value) {
//        try {
//            if (value == null || value.trim().isEmpty()) {
//                String errorMessage = INVALID_VISIT_TYPE_PREFIX + " Input visit type value cannot be null. {} ";
//                log.error(errorMessage, ALLOWED_VALUES_MESSAGE);
//                // throw new IllegalArgumentException(INVALID_VISIT_TYPE_PREFIX +" Input visit type value cannot be null. " + ALLOWED_VALUES_MESSAGE);
//                // return null;
//                throw new InvalidEnumValueException(errorMessage + " " + ALLOWED_VALUES_MESSAGE);
//
//            }
//            return VisitType.valueOf(value.toUpperCase());
//        } catch (IllegalArgumentException ex) {
//            String errorMessage = INVALID_VISIT_TYPE_PREFIX + " '{}'. {}";
//            log.error(errorMessage, value, ALLOWED_VALUES_MESSAGE);
//            // throw new IllegalArgumentException(INVALID_VISIT_TYPE_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
//            // return null;
//            throw new InvalidEnumValueException(errorMessage + " " + ALLOWED_VALUES_MESSAGE);
//        }
        if (value == null) {
            String errorMessage = INVALID_VISIT_TYPE_PREFIX + " Input visit type value cannot be null. {} ";
            log.error(errorMessage, ALLOWED_VALUES_MESSAGE);
            throw new InvalidEnumValueException(errorMessage + " " + ALLOWED_VALUES_MESSAGE);
        }

        return Arrays.stream(VisitType.values())
                .filter(b -> b.value.equalsIgnoreCase(value))
                .findFirst()
                // THIS IS THE KEY: If no match is found, throw our custom exception.
                .orElseThrow(() -> {
                    String availableValues = Arrays.stream(VisitType.values())
                            .map(VisitType::getValue)
                            .collect(Collectors.joining(", "));
                    String errorMessage = String.format(
                            "Invalid value '%s' for visitType. Accepted values are: [%s]",
                            value,
                            availableValues
                    );
                    return new InvalidEnumValueException(errorMessage);
                });
    }
}
