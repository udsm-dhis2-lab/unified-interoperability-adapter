package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum SpecimenAcceptanceStatus {
    REJECTED,
    ACCEPTED;

    public static final String INVALID_SPECIMEN_ACCEPTANCE_STATUS_PREFIX = "Invalid acceptance status:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(CareType.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static SpecimenAcceptanceStatus fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_CARE_TYPE_PREFIX + " Input CareType value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_SPECIMEN_ACCEPTANCE_STATUS_PREFIX + " Input CareType value cannot be null. {}", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return SpecimenAcceptanceStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_CARE_TYPE_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_SPECIMEN_ACCEPTANCE_STATUS_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
