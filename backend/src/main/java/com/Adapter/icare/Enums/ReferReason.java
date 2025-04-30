package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum ReferReason {
    CPAC,
    OTHERS;

    public static final String INVALID_REFER_REASON_PREFIX = "Invalid refer reason:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(ReferReason.values())
                            .map(Enum::name)
                            .collect(Collectors.joining(", "));

    @JsonCreator
    public static ReferReason fromString(String value) {
        try {
            if (value == null) {
                //throw new IllegalArgumentException(INVALID_REFER_REASON_PREFIX +" Input refer reason value cannot be null. " + ALLOWED_VALUES_MESSAGE);
                log.error(INVALID_REFER_REASON_PREFIX + " Input  refer reason value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }
            return ReferReason.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_REFER_REASON_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_REFER_REASON_PREFIX + " '{}'. {}", value, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }
}
