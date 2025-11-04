package com.Adapter.icare.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.stream.Collectors;

@Slf4j
public enum RequestTypeCode {
    DIAGNOSTIC("Diagnostic"),
    NON_DIAGNOSTIC("Non-Diagnostic");

    private final String requestTypeCode;

    public static final String INVALID_REQUEST_TYPE_CODE_PREFIX = "Invalid request type code:";
    private static final String ALLOWED_VALUES_MESSAGE =
            "Allowed values are: " +
                    Arrays.stream(RequestTypeCode.values())
                            .map(RequestTypeCode::getRequestTypeCode)
                            .collect(Collectors.joining(", "));

    private RequestTypeCode(String requestTypeCode) {
        this.requestTypeCode = requestTypeCode;
    }

    @JsonValue
    public String getRequestTypeCode() {
        return requestTypeCode;
    }

    @JsonCreator
    public static RequestTypeCode fromString(String requestTypeCode) {
        try {
            if (requestTypeCode == null) {
                log.error(INVALID_REQUEST_TYPE_CODE_PREFIX + " Input  request type code  value cannot be null. {} ", ALLOWED_VALUES_MESSAGE);
                return null;
            }

            for (RequestTypeCode requestTypeCodeValue : RequestTypeCode.values()) {
                if (requestTypeCodeValue.requestTypeCode.equalsIgnoreCase(requestTypeCode)) {
                    return requestTypeCodeValue;
                }

                if (requestTypeCode.equalsIgnoreCase("nd")) {
                    return RequestTypeCode.NON_DIAGNOSTIC;
                }

                if (requestTypeCode.equalsIgnoreCase("d")) {
                    return RequestTypeCode.DIAGNOSTIC;
                }
            }
            return null;
        } catch (IllegalArgumentException ex) {
            // throw new IllegalArgumentException(INVALID_REQUEST_TYPE_CODE_PREFIX + " '" + value + "'. " + ALLOWED_VALUES_MESSAGE, ex);
            log.error(INVALID_REQUEST_TYPE_CODE_PREFIX + " '{}'. {}", requestTypeCode, ALLOWED_VALUES_MESSAGE);
            return null;
        }
    }

}
