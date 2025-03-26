package com.Adapter.icare.Utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> validationErrorResponse = new LinkedHashMap<>();
        validationErrorResponse.put("status", "BAD_REQUEST");
        validationErrorResponse.put("statusCode", HttpStatus.BAD_REQUEST.value());
        validationErrorResponse.put("newClients", 0);
        validationErrorResponse.put("updatedClients", 0);
        validationErrorResponse.put("failedClients", 0);
        validationErrorResponse.put("ignoredClients", 0);
        validationErrorResponse.put("summary", new ArrayList<>());

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.put(error.getField(), error.getDefaultMessage()));
        validationErrorResponse.put("fieldErrors", fieldErrors);
        validationErrorResponse.put("message", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(validationErrorResponse);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleGenericExceptions(Exception ex) {
        Map<String, Object> errorResponse = new LinkedHashMap<>();

        errorResponse.put("status", "BAD_REQUEST");
        errorResponse.put("statusCode", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
