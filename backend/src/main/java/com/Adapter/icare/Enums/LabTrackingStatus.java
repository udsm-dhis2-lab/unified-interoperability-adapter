package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum LabTrackingStatus {
    X,
    A,
    F,
    R,
    I;

    public static final String INVALID_SPECIMEN_TRACKING_STATUS_PREFIX = "Invalid specimen tracking status:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(ServiceModality.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static LabTrackingStatus fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_SPECIMEN_ACCETANCE_STATUS_PREFIX +" Input specimen tracking status value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_SPECIMEN_TRACKING_STATUS_PREFIX + " Input  specimen tracking status  value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return LabTrackingStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_SPECIMEN_ACCETANCE_STATUS_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_SPECIMEN_TRACKING_STATUS_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
